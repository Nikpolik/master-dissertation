In this file i will try to record/document all architecture decisions.

The basic consept is to combine blocks. Each block will have designeted inputs and a single output.
Then a block can be passed to other blocks

A block can be any (pure) function that is registered to the manager. There is no special or magical syntax that
it needs to conform to. Presentation blocks are special cases that are React components.

The whole application's configuration is basically a tree where each block links to each of its inputs (children).
To render the application we traverse the tree and evaluate all children to recieve the output.

Basic blocks:

Utility/Types

These are some basic blocks used to provide values to other more complex objects.

They either need to special cased or we can just use a strategy pattern. Have each block also assign a picker.

Should this be special case of non function or should they be functions that just return their value;

Even though function calls provide overhead they will make the code cleaner and more managable.

In each reneder of react we simply need to call the method to retrieve its current value/state/whatever the the block represents.

Text/Number/Value
Array -> Used to create arrays of elements from single items. Will take as input the number of items and each item seperatly

Store
Store must have a key, it can then allow us to fetch its value

Page/Block State

The state of the application can be modeled in a tree like stracture. Each block stores information about its own state as well as links to its children. This can be achieved in two ways. Either deeply nested object. Or we can generate a uuid for each child and just holds links. We chose the second approach since it allows us to store and persist the state of each individual block seperatly.

To store block state we must generate a uuid for each child of a component. This will be used to index the state.

The developer of the block is responsible for using the output in a correct manner.

## Hook

Should we return the block directly from the hook that accesses the inputs?
Or should we have a helper function that accesses it from its uuid?
We need to know the type though to handle it properly.

## Important How primitive blocks will work

When a component that is a primite block is mountaned it will be transformed to a picker that will let the
user input its value

On the other hand a block that is a component/function/whatever will just have its name (in the same place that the picker would be)
and have its children (or nothing in case of a block without children) hanging bellow. :) I think this solution will solve the issues i am thinking
(how to switch between primite blocks and normal blocks, set initial state etc).

One thing to consider is if non primitive inputs will have a default value! This can be solved by setting some global state.
E.g. component that a component with type "1" has inputs "1,2,3" that have initial values 4,5,6!
