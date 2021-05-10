# eo-ts-backend

This project can run server to provide data for eo business project 2021.

## Getting started

Run following commands to start server on localhost:8080. Database must be placed in project root directory with `db.sqlite` filename.

```
npm i
npm start
```

## Supported endpoints

### Auctions

#### Get last 15 auctions ordered by start date:

```
/auctions/new
```

#### Get auction by uniqueID:

```
/auctions/:id
```

#### Search auction by name:

```
/auctions/q/:name
```

### Categories

#### Get list of all categories:

```
/categories
```

#### Get list of all subcategories of selected category:

```
/categories/:category
```

### Organizations

#### Get list of all organizations:

```
/organizations
```

#### Get organization by orgID:

```
/organizations/:id
```

### Participants

#### Get list of all participants:

```
/participants
```

#### Get participant by ID:

```
/participants/:id
```

### Stats

#### Get global system stats:

```
/stats
```

#### Get stats by category:

```
/stats/category/:category
```

#### Get stats by subcategory:

```
/stats/subcategory/:subcategory
```
