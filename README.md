# Raaraa

A discreet photo sharing site for party people.

## Discussion
- Image Serving
- Resource Based Authentication
- Friendings - how the * do they work?
- Available Communication Channels

## Components
- User
- PhotoStream
- Introducer
- Friending
- MutualAquaintances

### User
Sign-up is one easy step. Emits update event when PhotoStream is updated.

### PhotoStream
Stream of photos and shout outs from a single user or a collection of users.  Filterable.

### Introducer
Transmits a friend request to another user, creates a Friending if the other user accepts.

### Friending
Trust relationship between two users.

### MutualAquaintances
List of Users Friended with both Users in an given Friending.