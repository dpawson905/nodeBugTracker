User signs up for a local account. --DONE
User verifies account via email. --DONE
Once user is signed up they can create a project... --DONE
Once the project is set up, the user can add other users by their email address to have access to that project.
  - One of a few things can happen here...
    * The invited user has to be signed up and verified to be added to the project
    * The invited user will be sent an email with a code to use during verification
      * Use query strings with token and email to populate the form, this will skip verification because we know the email is valid.
  - jQuery autocomplete can be used if possible for autocompleting the searchfield for send a user an invite if they exist.

Once the project is set up and users are set up...
  - Users test out the app and report bugs and feature requests based on app usage.
  - The project creator can review these and set an importance level to each one.
  - A user that is set as a dev can be assigned to work on said issue/feature (possible feature)
  - A user can choose to work on said issue/feature (possible feature)
  - If this feature is implemented then it can only be assigned by the admin or it can only be picked by a user if the admin deems it important.

Possible features...
  - a poll can be created to see if users would want a specific feature and can vote on it.
  - a poll can only be created by an admin

If messages are implemented... 
 - Admins and devs can communicate with one another