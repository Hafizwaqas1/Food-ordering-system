from django.core.management.base import BaseCommand
from foodordering.models import Category, Food


class Command(BaseCommand):
    help = "Populate default food categories and foods"

    def handle(self, *args, **kwargs):

        # Categories
        categories = {
            "Pizza": [
                ("Chicken Pizza", 1200, "Delicious chicken pizza", "chicken-pizza.webp", "Medium"),
                ("Pepperoni Pizza", 1500, "Pepperoni pizza", "pepperoni piza.jpg", "Medium"),
            ],
            "Burger": [
                ("Beef Burger", 500, "Juicy beef burger", "beef burger.jpg", "Large"),
                ("Chicken Burger", 450, "Crispy chicken burger", "chicken burger.avif", "Large"),
                ("Zinger Burger", 550, "Spicy zinger burger", "Zinger.jpeg", "Large"),
                ("Fish Burger", 550, "Fish fillet burger", "fish-burger.webp", "Large"),
            ],
            "Biryani": [
                ("Chicken Biryani", 300, "Traditional chicken biryani", "biryani.jpg.webp", "Full"),
                ("Beef Biryani", 350, "Traditional beef biryani", "beef biryani.jpg", "Half"),
            ],
            "Drinks": [
                ("Coke", 100, "Cold drink", "coke.jpg", "500ml"),
                ("Pepsi", 100, "Cold drink", "pepsi.webp", "500ml"),
            ],
            "Desserts": [
                ("Brownie", 250, "Chocolate brownie", "chocolate-brownies.webp", "1 pc"),
                ("Chocolate Cake", 350, "Chocolate cake", "chocolatecake.jpeg", "1 slice"),
                ("Ice Cream", 200, "Vanilla ice cream", "ice cream.jpg", "1 cup"),
            ],
            "Fast Food": [
                ("Nuggets", 400, "Chicken nuggets", "nuggets.jpg", "6 pcs"),
                ("French Fries", 250, "Crispy fries", "crispy-french-fries.jpg", "Regular"),
                ("Club Sandwich", 450, "Club sandwich", "club-sandwich.webp", "1 pc"),
                ("Chicken Wrap", 320, "Chicken wrap", "chickenwrap.jpg", "1 pc"),
                ("Shawarma", 300, "Chicken shawarma", "shawarma.jpeg", "1 pc"),
            ],
        }

        total = 0

        for category_name, foods in categories.items():

            category, _ = Category.objects.get_or_create(
                category_name=category_name
            )

            for name, price, desc, image, qty in foods:

                obj, created = Food.objects.get_or_create(
                    item_name=name,
                    defaults={
                        "category": category,
                        "item_price": price,
                        "item_description": desc,
                        "image": f"food_images/{image}",
                        "item_quantity": qty,
                        "is_available": True,
                    },
                )

                if created:
                    total += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {total} food items."
            )
        )