from django.apps import AppConfig


class UserregitrationConfig(AppConfig):
    name = 'Userregistration'

from django.apps import AppConfig

class AccountsConfig(AppConfig):
    name = 'accounts'

    def ready(self):
        import Userregistration.signals

