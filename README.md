# E-commerce App with Express.js, Mongoose, and MongoDB

![GitHub package.json dynamic](https://img.shields.io/github/package-json/version/IMostafaR/e-commerce-nodejs-mongodb) ![GitHub repo size](https://img.shields.io/github/repo-size/IMostafaR/e-commerce-nodejs-mongodb)

![Dependencies](https://img.shields.io/badge/Dependencies-%20package.json-blue)

![Static Badge](https://img.shields.io/badge/Language-JavaScript-%23F7DF1E?logo=javascript&labelColor=black&color=%23F7DF1E)
![Static Badge](https://img.shields.io/badge/npm-v9.5.1-%23CB3837?logo=npm&labelColor=white&color=%23CB3837)
![Static Badge](https://img.shields.io/badge/node-v18.16.0-%23339933?logo=nodedotjs&labelColor=white&color=%23339933)
![Static Badge](https://img.shields.io/badge/Express.js-4.18.2-darkblue?logo=express&labelColor=black&color=darkblue)
![Static Badge](https://img.shields.io/badge/Database-MongoDB-%2347A248?logo=mongodb&labelColor=black&color=%2347A248)
![Static Badge](https://img.shields.io/badge/mongoose-v7.4.2-%23880000?logo=mongoose&labelColor=black&color=%23880000)
![Static Badge](https://img.shields.io/badge/bcrypt-v5.1.0-darkblue?labelColor=black&color=darkblue)
![Static Badge](https://img.shields.io/badge/cloudinary-v1.40.0-darkblue?logoColor=cloudflare&labelColor=black&color=darkblue)
![Static Badge](https://img.shields.io/badge/dotenv-v16.3.1-%23ECD53F?logo=dotenv&logoColor=cloudflare&labelColor=black&color=%23ECD53F)
![Static Badge](https://img.shields.io/badge/joi-v17.9.2-darkblue?logoColor=cloudflare&labelColor=black&color=darkblue)
![Static Badge](https://img.shields.io/badge/jsonwebtoken-v9.0.1-darkblue?logo=jsonwebtokens&logoColor=cloudflare&labelColor=black&color=darkblue)
![Static Badge](https://img.shields.io/badge/morgan-v1.10.0-darkblue?logoColor=cloudflare&labelColor=black&color=darkblue)
![Static Badge](https://img.shields.io/badge/multer-v1.4.5lts.1-darkblue?logoColor=cloudflare&labelColor=black&color=darkblue)
![Static Badge](https://img.shields.io/badge/nodemailer-v6.9.5-darkblue?logoColor=cloudflare&labelColor=black&color=darkblue)
![Static Badge](https://img.shields.io/badge/slugify-v1.6.6-darkblue?logoColor=cloudflare&labelColor=black&color=darkblue)
![Static Badge](https://img.shields.io/badge/uuid-v9.0.0-darkblue?logoColor=cloudflare&labelColor=black&color=darkblue)
![Static Badge](https://img.shields.io/badge/stripe-v13.9.0-darkblue?logo=stripe&labelColor=black)
![Static Badge](https://img.shields.io/badge/cors-v2.8.5-darkblue?labelColor=black)

# Table of Contents

1. [Introduction](#introduction)
2. [Project Requirements](#project-requirements)
3. [Database Analysis](#database-analysis)

4. [Author](#author)

# Introduction

This is my work during learning backend web development.

This is an e-commerce-Node.js application built with Express.js, Mongoose, and MongoDB, following the MVC (Model-View-Controller) design pattern.

---

# Project Requirements

1. **User Accounts**: Enable users to create accounts and log in to the platform.

2. **Contact Information**: Allow users to store personal details like their name, email, and phone number.

3. **Address Management**: Provide users with the ability to add multiple addresses to their account.

4. **Payment Methods**: Enable users to add and manage multiple payment methods.

5. **Product Catalog**: Develop a system capable of handling a wide range of products.

6. **Categorization**: Implement a category structure for products, allowing items to belong to one or more categories.

7. **Inventory Tracking**: Keep track of product availability by monitoring stock levels.

8. **Shopping Cart**: Facilitate users' shopping experience by letting them add items to a cart. Carts can be saved for logged-in users.

9. **Order Placement**: Require users to provide both payment and address details when placing an order.

10. **Shipping Options**: Provide users with a selection of shipping methods, each associated with a fixed price.

11. **Order Progress**: Implement an order processing system with stages such as order processing, delivery in progress, and order delivered.

12. **Customer Reviews**: Allow users to leave reviews for purchased products, including a rating and written feedback.

13. **Promotions**: Enable the platform to run promotions, allowing discounts on specific product categories.

---

# Database Analysis

![](./ERD.png)

1. Image:

   - \_id => ObjectId (Automatically generated primary key)
   - secure_url => String
   - public_id => String

2. Category:

   - \_id => ObjectId (Automatically generated primary key)
   - name => String
   - slug => String
   - image => Embedded Image document

3. Subcategory:

   - \_id => ObjectId (Automatically generated primary key)
   - name => String
   - slug => String
   - category_id: ObjectId (Reference to Category)

4. Brand:

   - \_id => ObjectId (Automatically generated primary key)
   - name => String
   - slug => String
   - image => Embedded Image document

5. Product:

   - \_id => ObjectId (Automatically generated primary key)
   - name => String
   - slug => String
   - mainImage => Embedded Image document
   - images => [Embedded Image documents]
   - description => String
   - price => Number
   - discount => Number
   - priceAfterDiscount => Number
   - ratingAvg => Number
   - rateCount => Number
   - stock => Number
   - soldItems => Number
   - category_id: ObjectId (Reference to Category)
   - subcategory_id: ObjectId (Reference to Subcategory)
   - brand_id: ObjectId (Reference to Brand)
   - createdBy: ObjectId (Reference to User)
   - updatedBy: ObjectId (Reference to User)

6. Review:

   - \_id => ObjectId (Automatically generated primary key)
   - title => String
   - content => String
   - rate => Number
   - product_id: ObjectId (Reference to Product)
   - customer_id: ObjectId (Reference to User)

7. Address:

   - \_id => ObjectId (Automatically generated primary key)
   - street => String
   - city => String
   - zipCode => Number
   - country => String
   - defaultAddress => Boolean

8. User:

   - \_id => ObjectId (Automatically generated primary key)
   - firstName => String
   - lastName => String
   - slug => String
   - email => String
   - password => String
   - phone => String
   - addresses: [Embedded Address documents]
   - role => String
   - verifiedEmail => Boolean
   - blocked => Boolean
   - deactivated => Boolean
   - wishlist: [ObjectID] (References to Products)

9. Cart:

   - \_id => ObjectId (Automatically generated primary key)
     **More attributes will be added later**

10. Coupon:

    - \_id => ObjectId (Automatically generated primary key)
    - code => String
    - expiresAt => Date
    - discount => Number
    - active => Boolean
    - customerIds: [ObjectID] (References to Users)

11. Order:

    - \_id => ObjectId (Automatically generated primary key)
      **More attributes will be added later**

---

## Author

- GitHub - [IMostafaR](https://github.com/IMostafaR)
- Linkedin - [@imostafarh](https://www.linkedin.com/in/imostafarh/)
