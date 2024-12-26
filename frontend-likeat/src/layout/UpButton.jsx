import { Button } from 'react-bootstrap';

const UpButton = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button className="scroll-to-top btn-dark" onClick={handleScrollToTop}>
      <i className="fas fa-angle-up"></i>
    </Button>
  );
};

export default UpButton;