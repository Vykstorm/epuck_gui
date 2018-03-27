
from threading import Thread, Lock


class EPuckReader(Thread):
    '''
    Esta clase se encarga de leer asíncronamente la información del robot e-puck.
    Debe haberse ejecutado un controlador del robot e-puck usando la librería pyepuck
    estableciendo el parámetro enable_streaming a True (de esta forma, se crea un servidor TCP
    que envía información del robot)
    '''
    def __init__(self, address, port):
        super().__init__()

        self.socket = ''
        self._alive = True
        self._alive_lock = Lock()

    @property
    def alive(self):
        with self._alive_lock:
            return self._alive

    @alive.setter
    def alive(self, state):
        with self._alive_lock:
            self._alive = state

    def _run(self):
        pass

    def run(self):
        try:
            self._run()
        except:
            pass
        finally:
            self.socket.close()

    def close(self):
        self.alive = False
        self.join()