
from threading import Thread, Lock, Condition
from socket import socket, AF_INET, SOCK_STREAM
import hashlib
import struct
import zlib
import json
from types import SimpleNamespace as Namespace



class EPuckReader(Thread):
    '''
    Esta clase se encarga de leer asíncronamente la información del robot e-puck.
    Debe haberse ejecutado un controlador del robot e-puck usando la librería pyepuck
    estableciendo el parámetro enable_streaming a True (de esta forma, se crea un servidor TCP
    que envía información del robot)
    '''
    def __init__(self, address = 'localhost', port = 19998):
        '''
        Inicializa esta instancia.
        :param address: Es la dirección del servidor donde se esta ejecutando el controlador, por defecto
        es localhost
        :param port: Es el puerto del controlador, por defecto 19998
        '''
        super().__init__()

        self.socket = socket(AF_INET, SOCK_STREAM)
        self.socket.settimeout(20)
        self.socket.connect((address, port))
        self.socket.settimeout(None)

        self._alive = True
        self._alive_lock = Lock()

        self._data = None
        self._data_lock = Condition()

        self.start()

    @property
    def alive(self):
        with self._alive_lock:
            return self._alive

    @alive.setter
    def alive(self, state):
        with self._alive_lock:
            self._alive = state

    def run(self):
        try:
            self._run()
        except Exception as e:
            pass
        finally:
            self.alive = False
            self.socket.close()

    def _run(self):
        while self.alive:
            self._read_data()

    def close(self):
        self.alive = False
        self.join()

    @property
    def data(self):
        with self._data_lock:
            self._data_lock.wait_for(lambda: not self._data is None)
            return self._data

    def _read_data(self):
        raw_data = self._read_raw_data()
        data_len, data = struct.unpack('!i', raw_data[16:20])[0], raw_data[20:]
        data = zlib.decompress(data[:data_len])
        data = json.loads(struct.unpack('!{}s'.format(len(data)), data)[0].decode())
        data = Namespace(**data)

        with self._data_lock:
            self._data = data
            self._data_lock.notify_all()

    def _read_raw_data(self):
        chunk_size = 1 << 11

        def read_chunk():
            chunk = bytearray()
            while len(chunk) < chunk_size:
                result = self.socket.recv(chunk_size - len(chunk))
                if result == bytearray():
                    raise IOError()
                chunk += result
            return chunk

        def verify_data(data):
            md5sum = struct.unpack('!16s', data[:16])[0]
            body = data[16:]

            hasher = hashlib.md5()
            hasher.update(body)
            return hasher.digest() == md5sum


        data = read_chunk()
        while not verify_data(data):
            data += read_chunk()

        return data
