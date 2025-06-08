# Greyball MMA Rankings API

A NestJS GraphQL API for managing MMA fighters, events, fights, and rankings.

## Description

This project provides a GraphQL API for managing MMA (Mixed Martial Arts) data, including:

- Fighters and their statistics
- Events and fight cards
- Fight results and outcomes
- Fighter rankings by weight class

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)

## Project Setup

1. Clone the repository and install dependencies:

```bash
git clone [repository-url]
cd greyball-tz
npm install
```

2. Set up environment variables:

```bash
# Copy the example env file, the default values in .env.example should work with Docker setup
cp .env.example .env
```

3. Start the database using Docker:

```bash
docker-compose up -d postgres
```

4. Run database migrations:

```bash
# Generate TypeORM entities
npm run typeorm migration:run
```

## Running the Application

1. Start the application in development mode:

```bash
npm run start:dev
```

2. Access the GraphQL Playground:

- In your browser navigate to `http://localhost:3000/graphql`
- You can now explore the API schema and execute queries/mutations

## Database Management

### Using Docker (Recommended)

The project includes a Docker setup for PostgreSQL:

```bash
docker-compose up -d postgres

docker-compose down

docker-compose logs postgres
```

## Project Structure

- `/src` - Source code
  - `/fighters` - Fighter-related modules and entities
  - `/events` - Event-related modules and entities
  - `/fights` - Fight-related modules and entities
  - `/rankings` - Ranking-related modules and entities
  - `/database` - Database migrations and configuration
- `/test` - Test files
- `/docker` - Docker configuration files
- `/docs` - ERD & API Documentation

## Ranking Algorithm

The ranking system uses a points-based algorithm to determine fighter rankings within each weight class. Here's how it works:

### Initial Ranking

When a fighter is first added to a weight class:

- Base points: 1000 points
- Initial position: Placed at the bottom of rankings (position 999)

### Points System

Points are awarded or deducted based on the following criteria:

#### Fight Outcomes

- Win: +800 points
- Loss: -400 points

#### Victory Bonuses

- Knockout (KO): +200 points
- Technical Knockout (TKO): +150 points
- Submission: +150 points
- Beating higher-ranked opponent: +100 points

### Ranking Updates

Rankings are automatically recalculated after each fight:

1. Winner receives points based on:
   - Base win points
   - Method of victory bonus
   - Opponent ranking bonus (if applicable)
2. Loser loses points
3. All fighters in the weight class are reordered based on total points
4. Positions are updated (1 = highest points)

### Protection Mechanisms

- Fighter points cannot go below 0
- Total KOs and submissions cannot exceed total wins
- Rankings are maintained separately for each weight class

### Implementation Notes

- Rankings update immediately after fight results are recorded
- Historical rankings are preserved through timestamps
- Rankings automatically adjust when fighters change weight classes

### Practical Example

Let's walk through a complete example of how the ranking system works:

#### Initial State

Two fighters in the Lightweight division:

```
Fighter A:
- Points: 1200
- Position: #3
- Record: 3-1

Fighter B:
- Points: 1000
- Position: #8
- Record: 2-1
```

#### Fight Outcome

Fighter B defeats Fighter A by KO in round 2

#### Points Calculation

Fighter B (Winner):

- Base win points: +800
- KO bonus: +200
- Higher-ranked opponent bonus: +100
- Total points added: +1100
- New total: 2100 points

Fighter A (Loser):

- Loss penalty: -400
- New total: 800 points

#### Rankings Update

After the fight, the system:

1. Updates both fighters' points
2. Reorders all fighters in the division based on points
3. Assigns new positions (Fighter B likely moves up several spots due to the big win)

Final State:

```
Fighter B:
- Points: 2100 (1000 + 1100)
- Position: #2 (moved up 6 spots)
- Record: 3-1

Fighter A:
- Points: 800 (1200 - 400)
- Position: #9 (dropped 6 spots)
- Record: 3-2
```

This example demonstrates how:

- Significant wins can rapidly advance a fighter's ranking
- The system rewards beating higher-ranked opponents
- Finish bonuses (KO/TKO/Submission) can accelerate advancement
- Rankings dynamically adjust to reflect recent performance

## Database Schema

![Database ERD](./docs/erd.png)

## GraphQL API Features

- **Fighters**: CRUD operations for fighter profiles
- **Events**: Manage fight events and cards
- **Fights**: Record fight results and outcomes
- **Rankings**: Automatic ranking calculations based on fight results

## Error Handling

The API includes comprehensive error handling for:

- Invalid input data
- Not found resources
- Database constraints
- Business logic violations

## Development

### Code Style

The project uses ESLint and Prettier for code formatting:
