## Questions

### What issues, if any, did you find with the existing code?
Initially the AccountDashboard code would attempt to set the account state variable even if the response was an error and it didn't actually contain the necessary information to update the account (not to mention that if it errors, logically there would
be nothing to update anyways). This meant that the user's name and the balance would stop showing up after an error occurred.

### What issues, if any, did you find with the request to add functionality?
I found most of the requests fairly straightforward other than the withdrawal limit of 400 dollars per day which took a bit more effort due to me having to make a new table to store transaction amounts and dates

### Would you modify the structure of this project if you were to start it over? If so, how?
I think the structure was fine and it was fairly easy to follow and figure out which files I needed to modify to accomplish the tasks

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
I completed all the assigned tasks for this project

### If you were to continue building this out, what would you like to add next?
I would definitely want to reset the deposit and withdrawal fields after the submit button was clicked to prevent users from accidentally depositing or withdrawing the same amount again.
Additionally, for the restrictions on transactions and deposits (such as not allowing more than 200 dollars to be withdrawn in 1 transaction), I would make the text entry field red when they enter more than 200 and disable the button
if that happened so that we wouldn't need to even send a request to the api when it isn't a valid amount. Also it would be a better user experience than having them read an alert that says why it didn't work

### If you have any other comments or info you'd like the reviewers to know, please add them below.