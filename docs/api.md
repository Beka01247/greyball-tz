# GraphQL API Documentation

## Overview

The MMA Rankings API provides a GraphQL interface for managing fighters, events, fights, and rankings in a mixed martial arts organization. The API is built using NestJS and uses PostgreSQL as the database.

## Base URL

```
http://localhost:3000/graphql
```

## Types

### Fighter

```graphql
type Fighter {
  id: ID!
  firstName: String!
  lastName: String!
  nickname: String
  birthDate: String
  country: String
  heightCm: Int
  reachCm: Int
  weightClass: String!
  isRetired: Boolean!
  wins: Int!
  losses: Int!
  draws: Int!
  knockouts: Int!
  submissions: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### Event

```graphql
type Event {
  id: ID!
  name: String!
  location: String!
  date: DateTime!
  isFinished: Boolean!
  fights: [Fight!]
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### Fight

```graphql
type Fight {
  id: ID!
  event: Event!
  fighter1: Fighter!
  fighter2: Fighter!
  winner: Fighter
  result: FightResult
  roundEnded: Int
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum FightResult {
  DECISION
  KO
  TKO
  SUBMISSION
  DQ
  NO_CONTEST
}
```

### Ranking

```graphql
type Ranking {
  id: ID!
  fighter: Fighter!
  weightClass: String!
  position: Int!
  points: Float!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

## Queries

### Fighters

```graphql
# Get all fighters
query {
  fighters {
    id
    firstName
    lastName
    weightClass
    record
  }
}

# Get a specific fighter by ID
query {
  fighter(id: "fighter-id") {
    id
    firstName
    lastName
    weightClass
    wins
    losses
    draws
  }
}
```

### Events

```graphql
# Get all events
query {
  events {
    id
    name
    location
    date
    isFinished
    fights {
      id
      fighter1 {
        firstName
        lastName
      }
      fighter2 {
        firstName
        lastName
      }
    }
  }
}

# Get upcoming events
query {
  upcomingEvents {
    id
    name
    location
    date
  }
}

# Get a specific event by ID
query {
  event(id: "event-id") {
    id
    name
    location
    date
    fights {
      id
      fighter1 {
        firstName
        lastName
      }
      fighter2 {
        firstName
        lastName
      }
      winner {
        firstName
        lastName
      }
      result
    }
  }
}
```

### Rankings

```graphql
# Get all rankings
query {
  rankings {
    id
    fighter {
      firstName
      lastName
    }
    weightClass
    position
    points
  }
}

# Get rankings for a specific weight class
query {
  rankingsByWeightClass(weightClass: "Lightweight") {
    position
    fighter {
      firstName
      lastName
    }
    points
  }
}
```

## Mutations

### Fighters

```graphql
# Create a new fighter
mutation {
  createFighter(
    createFighterInput: {
      firstName: "Test"
      lastName: "Test"
      weightClass: "Lightweight"
      nickname: "Test"
      country: "Kazakhstan"
      heightCm: 180
      reachCm: 188
    }
  ) {
    id
    firstName
    lastName
  }
}

# Update a fighter
mutation {
  updateFighter(
    updateFighterInput: { id: "fighter-id", wins: 10, losses: 2, knockouts: 5 }
  ) {
    id
    firstName
    lastName
    wins
    losses
    knockouts
  }
}
```

### Events

```graphql
# Create a new event
mutation {
  createEvent(
    createEventInput: {
      name: "UFC 229"
      location: "Las Vegas, NV"
      date: "2018-10-06T00:00:00Z"
    }
  ) {
    id
    name
    location
  }
}

# Update an event
mutation {
  updateEvent(updateEventInput: { id: "event-id", isFinished: true }) {
    id
    name
    isFinished
  }
}
```

### Fights

```graphql
# Create a new fight
mutation {
  createFight(
    createFightInput: {
      eventId: "event-id"
      fighter1Id: "fighter1-id"
      fighter2Id: "fighter2-id"
    }
  ) {
    id
    fighter1 {
      firstName
      lastName
    }
    fighter2 {
      firstName
      lastName
    }
  }
}

# Update fight result
mutation {
  updateFight(
    updateFightInput: {
      id: "fight-id"
      winnerId: "winner-fighter-id"
      result: KO
      roundEnded: 2
    }
  ) {
    id
    winner {
      firstName
      lastName
    }
    result
    roundEnded
  }
}
```

## Error Handling

The API returns standard GraphQL errors with the following structure:

```json
{
  "errors": [
    {
      "message": "Error message here",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["mutation_name"],
      "extensions": {
        "code": "ERROR_CODE",
        "exception": {
          "stacktrace": ["Error: Error message here"]
        }
      }
    }
  ]
}
```

Common error scenarios:

- Not Found (when requesting non-existent resources)
- Validation Errors (when input data is invalid)
- Business Logic Violations (e.g., invalid fight results)
