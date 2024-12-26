import backgroundImage from '/welcome-background.webp';

export const homeStyles = {
  background: {
    height: '100vh',
    left: '0%',
    bottom: '0%',
    position: 'fixed',
    width: '100vw',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
};