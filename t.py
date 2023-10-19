import random

# List of product names
product_names = [
    "Coffee", "Tea", "Milk", "Coconut", "Chocolate", "Bread", "Butter", "Cheese",
    "Eggs", "Rice", "Salt", "Sugar", "Honey", "Jam", "Juice", "Yogurt", "Cereal", "Soda",
    "Candies", "Chips", "Sausages", "Noodles", "Ketchup", "Mustard", "Mayonnaise",
    "Spaghetti", "Tuna", "Salmon", "Burger", "Pizza", "Pasta", "Rice", "Beans", "Lettuce",
    "Tomato", "Onion", "Potato", "Carrot", "Apple", "Banana", "Orange", "Grapes", "Strawberries",
    "Blueberries", "Cucumber", "Avocado", "Pineapple", "Watermelon"
]

# Generate random product names and prices
random_products = []
for _ in range(50):
    product_name = random.choice(product_names)
    product_price = round(random.uniform(1, 100), 2)
    random_products.append(f"{product_name}: {product_price}")

# Save the content to a text file
with open('random_products.txt', 'w') as file:
    for product in random_products:
        file.write(product + '\n')

print("Random products saved to random_products.txt")
