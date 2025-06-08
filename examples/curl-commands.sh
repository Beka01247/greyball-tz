# cURL commands for common operations

# Get all fighters
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "query { fighters { id firstName lastName weightClass wins losses } }"}' \
  http://localhost:3000/graphql

# Create a new fighter
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation($input: CreateFighterInput!) { createFighter(createFighterInput: $input) { id firstName lastName } }", "variables": {"input": {"firstName": "John", "lastName": "Doe", "weightClass": "Lightweight"}}}' \
  http://localhost:3000/graphql

# Get upcoming events
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "query { upcomingEvents { id name location date } }"}' \
  http://localhost:3000/graphql

# Create a new event
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation($input: CreateEventInput!) { createEvent(createEventInput: $input) { id name location } }", "variables": {"input": {"name": "UFC 300", "location": "Las Vegas", "date": "2025-07-01T00:00:00Z"}}}' \
  http://localhost:3000/graphql

# Get rankings for a weight class
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "query($weightClass: String!) { rankingsByWeightClass(weightClass: $weightClass) { position fighter { firstName lastName } points } }", "variables": {"weightClass": "Lightweight"}}' \
  http://localhost:3000/graphql

# Create a fight
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation($input: CreateFightInput!) { createFight(createFightInput: $input) { id fighter1 { firstName } fighter2 { firstName } } }", "variables": {"input": {"eventId": "event-uuid", "fighter1Id": "fighter1-uuid", "fighter2Id": "fighter2-uuid"}}}' \
  http://localhost:3000/graphql

# Update fight result
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation($input: UpdateFightInput!) { updateFight(updateFightInput: $input) { id winner { firstName } result roundEnded } }", "variables": {"input": {"id": "fight-uuid", "winnerId": "winner-uuid", "result": "KO", "roundEnded": 2}}}' \
  http://localhost:3000/graphql
