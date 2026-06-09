# Notification System Design
 
## Stage 1
 
### Priority Algorithm
Priority is determined by:
1. **Weight** by type: Placement=3, Result=2, Event=1
2. **Recency** — newer notifications rank higher within same type
 
### Formula
priorityScore = weight * 1_000_000_000 + unixTimestamp
 
### Top-N Selection
- Fetch all notifications, compute score, sort descending, return top N
- For production: use a max-heap for O(log n) inserts and O(1) reads
 
## Stage 2
 
### Architecture
React (TypeScript) + Material UI frontend
- Page 1: All Notifications — filter by type, pagination, read/unread
- Page 2: Priority Inbox — top N by priority score, user selects N
 
### Read/Unread Tracking
Stored in localStorage as a Set of notification IDs
 
### Logging
Every API call, page load, and state change is logged via the Logging Middleware
