## Task
As a contractor, I expect quotes to be accepted or rejected within 5 minutes of sending them. Otherwise the quote expires.

## Solution
Whenever the quote offers to any user, we can update pivot table `quotes_users` within column `created_at` or `offered_at` and then when the quote will be required by any user we can check the difference between current time and time when quote was created and mark it as `expired`.
