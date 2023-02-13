const ReadStatus = ({ readStatus }: { readStatus: boolean }) => {
  if (!readStatus) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24px"
        height="24px"
      >
        <circle
          fill="var(--ds-icon-brand, #0052CC)"
          cx="50%"
          cy="50%"
          r="4"
        ></circle>
      </svg>
    );
  } else return <></>;
};
export default ReadStatus;
