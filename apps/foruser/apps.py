from django.apps import AppConfig


class ForuserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.foruser'
    def ready(self):
        import apps.foruser.signals
