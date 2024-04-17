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
  url: 'https://hsse.mypge.id/cuaca/api',
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
- Participants are free to use the programming language they are proficient in..
- Create visualizations based on the weather forecast data.
- Submit your final code new branch | yourname_dev.


## Judging Criteria

- Creativity and innovation in visualization.
- Functionality and accuracy of the visualization.
- Code quality and Faster.
- Responsiveness and user experience.

Happy hacking!
