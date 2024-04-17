# PGE Weather Forecast Visualization Hackathon

## Overview

This hackathon focuses on creating visualizations for the PGE weather forecast data using a provided API. Participants will have 3 hours to develop their visualizations and submit their work for judging.

## Resources

### API Information

The weather forecast data is retrieved from the following API endpoint:

```
https://publik.bmkg.go.id/pge/forecast24h
```

### Request Example

```typescript
const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://publik.bmkg.go.id/pge/forecast24h',
  headers: { 
    'access_token': ''
  }
};

axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
```

## Hackathon Rules
![Gambar Cuaca](/assets/image.png)
- Participants use any langue programing.
- Create visualizations based on the weather forecast data.
- Submit your final code via a pull request to the main branch.


## Judging Criteria

- Creativity and innovation in visualization.
- Functionality and accuracy of the visualization.
- Code quality and Faster.
- Responsiveness and user experience.

Happy hacking!