from django.apps import AppConfig


class ForuserConfig(AppConfig):
    name = 'apps.foruser'

from django.apps import AppConfig

class AccountsConfig(AppConfig):
    name = 'accounts'

    def ready(self):
        pass

