import axios from 'axios';

const logEvent = async (event) => {
    try {
        const response = await axios.post('http://localhost:3001/log', event);
        console.log('Event logged:', response.data);
    } catch (error) {
        console.error('Error logging event:', error);
    }
};

export default logEvent;
