
# principles

1. it's a component-based framework
2. component is self-contained object, which means it handles its view and logic, and communicate with its parent when necessary
3. it's easy to compose different components together to form a bigger one, no matter the source comes from template (like JSX role in React.js), or real dom (need to support this static way of rendering)
4. it's easy to use 3rd library

# test

create a tab control component, to which user can add tab item

# architecture

1. parent owns children, but no children's children.
2. child only notifies parent about certain events, and handles others by itself.
3. parent can directly invoke child public method to update its state

# how to init component

we use "name" attr to inject children into parent object

* child with `$name` will become an attr `$name` of parent
* several children with same name will become an array `$name + "s"` of parent
* `children` is a reserved name for all its children
* `content` is a reserved name for all content inside parent tag

# build connection

there're 2 ways to build parent-child connection:

## dynamic template

as mentioned before, component should handle its view, so the best place to bind a view with component is in its constructor.
