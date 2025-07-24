import PropTypes from 'prop-types';
import styled from 'styled-components';

const IconContainer = ({
  className,
  src,
  margin,
  fontSize,
  onClick,
  style,
  inactive,
}) => {
  return (
    <img
      className={className}
      src={src}
      alt="icon"
      style={{ margin: margin || '0', fontSize: fontSize || '24px', ...style }}
      onClick={onClick}
    />
  );
};

export const Icon = styled(IconContainer)`
  width: ${({ fontSize }) => fontSize || '24px'};
  height: ${({ fontSize }) => fontSize || '24px'};
  &:hover {
    cursor: ${({ inactive }) => (inactive ? 'default' : 'pointer')};
  }
`;

Icon.propTypes = {
  src: PropTypes.string.isRequired,
  margin: PropTypes.string,
  fontSize: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
  inactive: PropTypes.bool,
};
