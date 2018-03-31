
from setuptools import setup


setup(
    name = 'pyepuck_gui',
    version = '1.0.0',
    description = 'Tiny graphical user interface implemented in python for web browsers to visualize e-puck robot',
    url = 'https://github.com/Vykstorm/pyepuck_gui',
    author = 'Vykstorm',
    author_email = 'victorruizgomezdev@gmail.com',
    license = 'MIT',
    zip_safe = False,
    packages = [''],
    install_requires = ['Pillow', 'Flask'],
    include_package_data = True
)