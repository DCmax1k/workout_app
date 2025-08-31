export default function formatDate(timestamp, opt = {},) {
        const date = new Date(timestamp);
      
        const options = { weekday: 'long', month: 'short', day: 'numeric', ...opt };
        return date.toLocaleDateString('en-US', options);
      }