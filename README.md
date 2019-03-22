# DENZEL

> The must-watch Denzel's movies

## DEPLOYMENT URL

https://denzel.glitch.me

## REST API

same requests that are in the readme

## GRAPHQL

> You can do the same thing as with the rest API


Here is some exemple request

### populate
```sh
query{
  populate
}
```

### random movie
```sh
query{
  movie {id title year metascore}
}
```

### movies search
```sh
query{
  movies(limit: 3, metascore: 70) {link metascore synopsis title year id}
}
```

### set review
```sh
query{
  review(id: "tt0368008", date: "2019-03-04", review: "😍 🔥")
}
```

### movie by id
```sh
query{
  movie(id: "tt0368008") {link metascore synopsis title year review{date review}}
}
```

As you can see, the review was added

