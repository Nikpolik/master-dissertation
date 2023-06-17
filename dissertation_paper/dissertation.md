Dissertation will be first written in txt and then migrated to word.

Chapter 1 - Introduction

Write about the need of creating websites, for small/medium business, products everything.

There are few programmeres so people need to learn how to do it themeselves.

Describe end user programming and what it means

Analyze products like wix, wordpress how they allow users to create their own platofmrs aim to do it.

Chapter 2 - Literature Review

Chapter 3 - System Requirements and Use cases

Overview

The main purpose of the application been implemented, is to serve as a prototype of a block-based visual editor for creating websites.
This tool will allow a user to create pages, edit their content and then make them available publicly.

The block-based visual editor for creating websites is a prototype tool that allows users to create, edit, and publish pages for a single page application. It is designed to provide a flexible and user-friendly interface for building websites, enabling users to compose pages using a variety of customizable blocks or elements, and arrange and customize them using a range of tools and properties. The visual editor also enables users to add simple custom interactions or functionality to their pages, allowing them to create interactive and dynamic websites that engage and empower their audiences.

The primary goal of the visual editor is to provide an end user development platform that simplifies the process of creating and maintaining websites, while still offering sufficient customization and flexibility to meet the diverse needs of users. By providing a block-based approach to page design, the visual editor aims to make it easier for users to create and modify pages, even if they have limited technical expertise or coding skills. The visual editor also aims to streamline the workflow of creating and publishing pages, enabling users to focus on creating high-quality content and interacting with their audience, rather than worrying about technical details or logistics.

Use cases

3.1. Create Page

The "Create Page" use case refers to the process of creating a new page within the visual editor for a single page application. This process involves selecting and changing blocks or elements using buttons and a floating modal picker, arranging and customizing them by assigning blocks or elements to predefined inputs on certain blocks, and adding simple custom interactions or functionality as desired. The user may also have the option to preview the created page before saving it. The goal of the "Create Page" use case is to provide a flexible and user-friendly way for users to create new pages within the visual editor, ensuring that the resulting pages accurately reflect their intended design and functionality.

To create a new page within the visual editor, the user might follow the following steps: they would first select the "Create Page" option from the visual editor's menu, then select and change blocks or elements using buttons and a floating modal picker. The user would then arrange and customize the blocks or elements by assigning them to predefined inputs on certain blocks, and add simple custom interactions or functionality as desired. They would then preview the created page to see how it will look and function, and save the created page by clicking the "Save" button in the top menu. The user may also have the option to discard the created page if they are not satisfied with it. Overall, the "Create Page" use case aims to provide a streamlined and intuitive way for users to create new pages within the visual editor using the input assignment method

3.2. Update Page

The "Update Page" use case refers to the process of modifying an existing page within the visual editor for a single page application. This might involve making changes to the layout and content of the page, as well as adding or modifying simple custom interactions or functionality. The user might also have the option to preview the updated page before saving their changes. The goal of the "Update Page" use case is to allow users to easily make changes to existing pages within the visual editor, and to ensure that the resulting updates accurately reflect their intended design and functionality.

To update a page within the visual editor, the user might follow these steps: 1) select the page they want to update from a list of pages within the visual editor, 2) make changes to the layout and content of the page using the visual editor's tools and properties panel, 3) preview the updated page to see how it will look and function, 4) save the updated page by clicking the "Save" button in the top menu. The user might also have the option to revert their changes if they are not satisfied with the updated page. Overall, the "Update Page" use case provides a flexible and user-friendly way for users to make changes to their pages within the visual editor.

3.3. Publish Page

The "Publish Page" use case refers to the process of making an existing page within the visual editor for a single page application live and accessible on the single page application. This process involves publishing the page to the single page application, making it accessible as a single page application in the platform. The user may also have the option to preview the published page before making it live. The goal of the "Publish Page" use case is to provide a simple and straightforward way for users to make their pages live and accessible on the single page application, once they have completed the design and customization process within the visual editor.

To publish a page within the visual editor, the user would first select the page they want to publish from a list of pages within the visual editor. They would then click the "Publish" button in the top menu. This would trigger the page to be published to the single page application, making it live and accessible as a single page application in the platform. The user may also have the option to preview the published page before making it live, to ensure that it looks and functions as intended. Once the page is live, the user can continue to edit or publish other pages as desired.

3.4. Register

The "Register" use case allows users to create a new account within the visual editor for a single page application. To register, the user clicks the "Register" button in the top menu and fills out the registration form with their personal information. If the information is valid, the user is registered for a new account and redirected to their account page. If the information is invalid or incomplete, the user receives an error message and must try registering again. The "Register" use case aims to provide a simple and convenient way for users to create a new account, enabling them to create and manage pages and interact with other users. It also ensures that user information is collected and stored in a secure and privacy-compliant manner.

3.5. Login

The "Login" use case enables users to verify their identity and access their account within the visual editor for a single page application. To log in, the user clicks the "Login" button in the top menu and enters their username and password in the login form. If the credentials are valid, the user is logged in and redirected to their account page. If the credentials are invalid, the user receives an error message and must try logging in again. The "Login" use case aims to provide a secure and convenient way for users to access their account, enabling them to create and manage pages and interact with other users. It also protects the privacy and security of user information by ensuring that only authorized users can access the visual editor.

When using the editor the user should be able to change almost every aspect of the website he is creating.

Chapter 4 - UX Design

Chapter 5 - Application Desing / Implementation

The design of the application consists of four main components: the editor, the core, the page renderer, and the server. The editor is the user interface where users can create and edit pages using block-based elements. The core serves as the central hub for the other components, providing them with access to the necessary information and logic they need to function. It coordinates the activities of the other components and manages the overall implementation and operation of the blocks. The page renderer reads the block state from the core and renders the page for preview or public viewing. The server persists the state and is used to share it between users, as well as handle authentication and authorization. Each component plays a vital role in the overall functioning of the application, and they must work together seamlessly to provide an effective visual editor for single page applications.

-- Should we talk about trees and deapth first search here?

The design of the application was split in to four separate components that will work together to produce the final tool. These
are the core, the editor, the page rendering and the server.

Core.

The core component of the visual editor encompasses the underlying logic for representing and updating the state of a page.
This component assumes a critical role in shaping the overall development trajectory of the editor, as it significantly impacts
the implementation of other system components. Designing and implementing the core component with precision is critical to create
a highly functional visual editor. Its impact on other components means careful planning is necessary to maximize the editor's
capabilities.

1. Blocks Representation

1.1 Block

In the visual editor, blocks are the most fundemental element that allows users to create complex applications without having to write code.
Each block represents a specific function or concept and can be combined with other blocks to create more complex behaviors. Four distinct
types of blocks, namely visual, data, control, and action/functions, have been defined in this prototype. Each block type has specific functions in
the editing and programming of single-page applications, and the prototype is designed to incorporate all four types to ensure comprehensive
functionality.

1.2 Page State

A tree structure was chosen where each node represents a block. Then then node can either link to its children or be a leave. This approach was
heavily inspired by DOM's (Document Object Model) [link here] represantation of web documents. When generating the final
application we traverse recursivly from the root of the tree to its leaves and render each invidvidual node.

Instead of having a large deeply nested javascript object containing all states, a uuid is generated for each block. The uuid
specification allows us to generate identifiers that are globally unique [https://www.rfc-editor.org/rfc/rfc4122.txt]. These
identifiers can then used as keys to store and persists the state of each individual block seperatly, so we can avoid traversing
the whole tree everytime a block needs to be edited.

-- insert code of node model here

After describing the state of a page the next is to define how the blocks will be actually function.

1.3 Creating a new Page State

1.4 Inserting a new Block

1.5 Updating a Block

blocks/\*.tsx

Second Editor

Third Website rendering

Fourth server, authorization, authentication, storing data

Fifth Develoepd using web technologies

Chapter 7 - Evaluation

Chapter 8 - Conclusion
