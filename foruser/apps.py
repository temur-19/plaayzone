from django.apps import AppConfig


class UserregitrationConfig(AppConfig):
    name = 'foruser'

from django.apps import AppConfig

class AccountsConfig(AppConfig):
    name = 'accounts'

    def ready(self):
        import foruser.signals

