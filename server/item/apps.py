from django.apps import AppConfig

class ItemConfig(AppConfig):
    name = 'item'  # This must match the actual application directory name
    verbose_name = 'Item Management'  # Optional more descriptive name

    def ready(self):
        import item.signals

