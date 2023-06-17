1. Add support for textarea inputs. Maybe have a variation prop?
2. Improve design by reducing clutter with smaller block sizes
3. We need to use the following really simple logic for creating the application:
   1. Fetch Configuration
   2. Render the application
   3. Adjust Configuration
   4. Rerender the whole application

We cannot rely on react rerendering when adjusting blocks in the application.
We must kill it and rerender again.
Maybe this could be done by rendering a whole different React App inside that only runs the application code.
