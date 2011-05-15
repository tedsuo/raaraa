# Raaraa

A discreet photo sharing site for party people.

## Discussion
- Image Serving
- Resource Based Authentication
- Connections - how the * do they work?
- Available Communication Channels

## Components
- User
- PhotoStream
- Introducer
- Friending
- MutualAquaintances
- Feed

### User
Sign-up is one easy step. Emits update event when PhotoStream is updated.

### PhotoStream
Stream of photos and shout outs from a single user.

### Introducer
Transmits a friend request to another user, creates a Friending if the other user accepts.

### Friending
Trust relationship between two users.

### MutualAquaintances
List of Users with a Friending that matches one of two given Users.  Updates whenever a referenced user updates their PhotoStream.

### Feed
Collected PhotoStreams of MutualAquaintances.  Generated every time a PhotoStream the MutualAquaintance is updated.