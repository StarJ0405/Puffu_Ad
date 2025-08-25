const HeartIcon = ({
  width = 19,
  height = 16,
  isFilled = false,
  color = "var(--main-color)",
  stroke = "var(--main-color)",
  onClick,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 19 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ cursor: "pointer",}}
    onClick={onClick}
  >
    <path
      d="M9.03239 3.18462L9.41111 3.53803L9.78983 3.18462L10.4838 2.53705C12.1868 0.947851 14.9629 0.947851 16.6659 2.53705C18.3471 4.1058 18.3471 6.63229 16.6659 8.20103L9.41111 14.9709L2.15629 8.20103C0.475162 6.63228 0.475162 4.1058 2.15629 2.53705C3.85934 0.947851 6.63538 0.947851 8.33843 2.53705L9.03239 3.18462Z"
      fill={isFilled ? color : "none"}
      stroke={stroke}
      strokeWidth="1.11022"
    />
  </svg>
);

export default HeartIcon;
