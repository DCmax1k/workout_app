export default function formatDate(timestamp) {
        const date = new Date(timestamp);
      
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      }