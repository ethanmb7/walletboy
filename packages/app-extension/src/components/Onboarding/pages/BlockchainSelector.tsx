import { Box, Grid, Typography } from "@mui/material";
import { Blockchain } from "@coral-xyz/common";
import { Header, PrimaryButton, SubtextParagraph } from "../../common";
import { ActionCard } from "../../common/Layout/ActionCard";

export const BlockchainSelector = ({
  selectedBlockchains,
  onClick,
  onNext,
}: {
  selectedBlockchains: Array<Blockchain>;
  onClick: (blockchain: Blockchain) => void;
  onNext: () => void;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box
          sx={{
            marginLeft: "24px",
            marginRight: "24px",
            marginTop: "24px",
          }}
        >
          <Header text="Which networks would you like Backpack to use?" />
          <SubtextParagraph>
            Select one or more. You can change this later in the settings menu.
          </SubtextParagraph>
        </Box>
        <Box style={{ padding: "0 16px 16px" }}>
          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <ActionCard
                icon={<EthereumIcon />}
                text={`Ethereum`}
                textAdornment={
                  selectedBlockchains.includes(Blockchain.ETHEREUM) ? (
                    <CheckBadge />
                  ) : (
                    ""
                  )
                }
                onClick={() => onClick(Blockchain.ETHEREUM)}
              />
            </Grid>
            <Grid item xs={6}>
              <ActionCard
                icon={<SolanaIcon />}
                text={`Solana`}
                textAdornment={
                  selectedBlockchains.includes(Blockchain.SOLANA) ? (
                    <CheckBadge />
                  ) : (
                    ""
                  )
                }
                onClick={() => onClick(Blockchain.SOLANA)}
              />
            </Grid>
            <Grid item xs={6}>
              <ActionCard
                icon={<PolygonIcon />}
                text="Polygon"
                textAdornment={<SoonBadge />}
                onClick={() => {}}
                disabled={true}
              />
            </Grid>
            <Grid item xs={6}>
              <ActionCard
                icon={<BscIcon />}
                text="BSC"
                textAdornment={<SoonBadge />}
                onClick={() => {}}
                disabled={true}
              />
            </Grid>
            {/*
            <Grid item xs={6}>
              <ActionCard
                icon={<AvalancheIcon />}
                text="Avalanche"
                textAdornment={<SoonBadge />}
                onClick={() => {}}
                disabled={true}
              />
            </Grid>
            <Grid item xs={6}>
              <ActionCard
                icon={<CosmosIcon />}
                text="Cosmos"
                textAdornment={<SoonBadge />}
                onClick={() => {}}
                disabled={true}
              />
            </Grid>
            */}
          </Grid>
        </Box>
      </Box>
      <Box style={{ padding: "16px" }}>
        <PrimaryButton
          label="Next"
          onClick={onNext}
          disabled={selectedBlockchains.length === 0}
        />
      </Box>
    </Box>
  );
};

function CheckBadge() {
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        top: "4px",
        left: "5px",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM6.9675 12.2175L4.275 9.525C3.9825 9.2325 3.9825 8.76 4.275 8.4675C4.5675 8.175 5.04 8.175 5.3325 8.4675L7.5 10.6275L12.66 5.4675C12.9525 5.175 13.425 5.175 13.7175 5.4675C14.01 5.76 14.01 6.2325 13.7175 6.525L8.025 12.2175C7.74 12.51 7.26 12.51 6.9675 12.2175Z"
          fill="#42C337"
        />
      </svg>
    </div>
  );
}

function SoonBadge() {
  return (
    <div
      style={{
        paddingLeft: "8px",
        paddingRight: "8px",
        paddingTop: "2px",
        paddingBottom: "2px",
        backgroundColor: "rgb(206, 121, 7, 0.15)",
        height: "20px",
        borderRadius: "10px",
        display: "inline-block",
        marginLeft: "4px",
      }}
    >
      <Typography
        style={{
          color: "#EFA411",
          fontSize: "12px",
          lineHeight: "16px",
          fontWeight: 600,
        }}
      >
        soon
      </Typography>
    </div>
  );
}

function EthereumIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_12985_2265)">
        <path
          d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
          fill="#627EEA"
        />
        <path
          d="M20.6226 5V16.0875L29.9938 20.275L20.6226 5Z"
          fill="white"
          fillOpacity="0.602"
        />
        <path d="M20.6225 5L11.25 20.275L20.6225 16.0875V5Z" fill="white" />
        <path
          d="M20.6226 27.46V34.9938L30.0001 22.02L20.6226 27.46Z"
          fill="white"
          fillOpacity="0.602"
        />
        <path
          d="M20.6225 34.9938V27.4588L11.25 22.02L20.6225 34.9938Z"
          fill="white"
        />
        <path
          d="M20.6226 25.7163L29.9938 20.2751L20.6226 16.0901V25.7163Z"
          fill="white"
          fillOpacity="0.2"
        />
        <path
          d="M11.25 20.2751L20.6225 25.7163V16.0901L11.25 20.2751Z"
          fill="white"
          fillOpacity="0.602"
        />
      </g>
      <defs>
        <clipPath id="clip0_12985_2265">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function SolanaIcon() {
  return (
    <svg
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_12985_2881)">
        <path
          d="M20.5 40C31.5457 40 40.5 31.0457 40.5 20C40.5 8.95431 31.5457 0 20.5 0C9.45431 0 0.5 8.95431 0.5 20C0.5 31.0457 9.45431 40 20.5 40Z"
          fill="black"
        />
        <path
          d="M40 20C40 30.7696 31.2696 39.5 20.5 39.5C9.73045 39.5 1 30.7696 1 20C1 9.23045 9.73045 0.5 20.5 0.5C31.2696 0.5 40 9.23045 40 20Z"
          stroke="white"
          strokeOpacity="0.15"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.8419 25.513C12.9172 25.4302 13.0089 25.3641 13.1112 25.3188C13.2134 25.2735 13.3241 25.2501 13.4359 25.25L31.7639 25.265C31.842 25.2652 31.9183 25.288 31.9836 25.3307C32.049 25.3734 32.1005 25.4342 32.1319 25.5056C32.1634 25.577 32.1734 25.6561 32.1608 25.7331C32.1482 25.8101 32.1135 25.8818 32.0609 25.9395L28.1579 30.237C28.0826 30.3198 27.9908 30.386 27.8885 30.4313C27.7861 30.4766 27.6754 30.5 27.5634 30.5L9.23592 30.485C9.15787 30.4848 9.08154 30.462 9.01621 30.4193C8.95088 30.3766 8.89936 30.3158 8.86791 30.2444C8.83646 30.173 8.82642 30.0939 8.83903 30.0169C8.85163 29.9399 8.88634 29.8682 8.93892 29.8105L12.8419 25.513ZM32.0609 21.9355C32.1135 21.9932 32.1482 22.0649 32.1608 22.1419C32.1734 22.2189 32.1634 22.298 32.1319 22.3694C32.1005 22.4408 32.049 22.5016 31.9836 22.5443C31.9183 22.587 31.842 22.6098 31.7639 22.61L13.4364 22.625C13.3245 22.625 13.2138 22.6016 13.1114 22.5563C13.009 22.511 12.9172 22.4448 12.8419 22.362L8.93892 18.062C8.88634 18.0043 8.85163 17.9326 8.83903 17.8556C8.82642 17.7786 8.83646 17.6995 8.86791 17.6281C8.89936 17.5567 8.95088 17.4959 9.01621 17.4532C9.08154 17.4105 9.15787 17.3877 9.23592 17.3875L27.5639 17.3725C27.6758 17.3726 27.7864 17.396 27.8887 17.4413C27.991 17.4866 28.0827 17.5527 28.1579 17.6355L32.0609 21.9355ZM12.8419 9.763C12.9172 9.68023 13.0089 9.61408 13.1112 9.56879C13.2134 9.52351 13.3241 9.50007 13.4359 9.5L31.7639 9.515C31.842 9.51516 31.9183 9.53798 31.9836 9.58069C32.049 9.6234 32.1005 9.68416 32.1319 9.75559C32.1634 9.82703 32.1734 9.90606 32.1608 9.98308C32.1482 10.0601 32.1135 10.1318 32.0609 10.1895L28.1579 14.487C28.0826 14.5698 27.9908 14.636 27.8885 14.6813C27.7861 14.7266 27.6754 14.75 27.5634 14.75L9.23592 14.735C9.15787 14.7348 9.08154 14.712 9.01621 14.6693C8.95088 14.6266 8.89936 14.5658 8.86791 14.4944C8.83646 14.423 8.82642 14.3439 8.83903 14.2669C8.85163 14.1899 8.88634 14.1182 8.93892 14.0605L12.8419 9.763Z"
          fill="url(#paint0_linear_12985_2881)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_12985_2881"
          x1="9.54192"
          y1="30.958"
          x2="31.4579"
          y2="9.04199"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9945FF" />
          <stop offset="0.2" stopColor="#7962E7" />
          <stop offset="1" stopColor="#00D18C" />
        </linearGradient>
        <clipPath id="clip0_12985_2881">
          <rect
            width="40"
            height="40"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function PolygonIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_12985_7928)">
        <path
          d="M20 40C31.0457 40 40 31.0457 40 20C40 8.95431 31.0457 0 20 0C8.95431 0 0 8.95431 0 20C0 31.0457 8.95431 40 20 40Z"
          fill="#8247E5"
        />
        <path
          d="M26.4962 15.7989C26.0322 15.5383 25.4356 15.5383 24.9053 15.7989L21.1932 17.9481L18.6742 19.3158L15.0284 21.4651C14.5644 21.7256 13.9678 21.7256 13.4375 21.4651L10.5871 19.7717C10.1231 19.5112 9.79164 18.9902 9.79164 18.404V15.1476C9.79164 14.6265 10.0568 14.1055 10.5871 13.7799L13.4375 12.1516C13.9015 11.8911 14.4981 11.8911 15.0284 12.1516L17.8788 13.845C18.3428 14.1055 18.6742 14.6265 18.6742 15.2127V17.3619L21.1932 15.9291V13.7147C21.1932 13.1937 20.928 12.6727 20.3977 12.347L15.0947 9.28596C14.6307 9.02545 14.0341 9.02545 13.5038 9.28596L8.06816 12.4122C7.53786 12.6727 7.27271 13.1937 7.27271 13.7147V19.8368C7.27271 20.3579 7.53786 20.8789 8.06816 21.2046L13.4375 24.2656C13.9015 24.5261 14.4981 24.5261 15.0284 24.2656L18.6742 22.1815L21.1932 20.7486L24.839 18.6645C25.303 18.404 25.8996 18.404 26.4299 18.6645L29.2803 20.2927C29.7443 20.5533 30.0757 21.0743 30.0757 21.6605V24.9169C30.0757 25.4379 29.8106 25.959 29.2803 26.2846L26.4962 27.9128C26.0322 28.1733 25.4356 28.1733 24.9053 27.9128L22.0549 26.2846C21.5909 26.0241 21.2594 25.5031 21.2594 24.9169V22.8328L18.7405 24.2656V26.4149C18.7405 26.9359 19.0057 27.4569 19.536 27.7826L24.9053 30.8436C25.3693 31.1041 25.9659 31.1041 26.4962 30.8436L31.8655 27.7826C32.3295 27.5221 32.661 27.001 32.661 26.4149V20.2276C32.661 19.7066 32.3958 19.1856 31.8655 18.8599L26.4962 15.7989Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_12985_7928">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function BscIcon() {
  return (
    <svg
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_12985_1000)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.5 0C31.5465 0 40.5 8.95353 40.5 20C40.5 31.0465 31.5465 40 20.5 40C9.45353 40 0.5 31.0465 0.5 20C0.5 8.95353 9.45353 0 20.5 0Z"
          fill="#F0B90B"
        />
        <path
          d="M11.492 20.0001L11.5064 25.2886L16 27.9328V31.0289L8.8766 26.8511V18.4536L11.492 20.0001ZM11.492 14.7116V17.7934L8.875 16.2453V13.1636L11.492 11.6155L14.1218 13.1636L11.492 14.7116ZM17.8766 13.1636L20.4936 11.6155L23.1234 13.1636L20.4936 14.7116L17.8766 13.1636Z"
          fill="white"
        />
        <path
          d="M13.3831 24.1924V21.0962L16 22.6443V25.7261L13.3831 24.1924ZM17.8766 29.0418L20.4936 30.5898L23.1234 29.0418V32.1235L20.4936 33.6716L17.8766 32.1235V29.0418ZM26.8766 13.1636L29.4936 11.6155L32.1234 13.1636V16.2453L29.4936 17.7934V14.7116L26.8766 13.1636ZM29.4936 25.2886L29.5081 20.0001L32.125 18.452V26.8495L25.0016 31.0273V27.9312L29.4936 25.2886Z"
          fill="white"
        />
        <path
          d="M27.617 24.1923L25 25.726V22.6443L27.617 21.0962V24.1923Z"
          fill="white"
        />
        <path
          d="M27.617 15.8078L27.6315 18.9039L23.125 21.5482V26.8495L20.5081 28.3831L17.8911 26.8495V21.5482L13.3847 18.9039V15.8078L16.0129 14.2597L20.492 16.9168L24.9984 14.2597L27.6282 15.8078H27.617ZM13.3831 10.5209L20.4936 6.32861L27.617 10.5209L25 12.069L20.4936 9.41195L16 12.069L13.3831 10.5209Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_12985_1000">
          <rect
            width="40"
            height="40"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function AvalancheIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_12941_55236)">
        <path
          d="M32.3352 6.86182H7.63794V29.3086H32.3352V6.86182Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M39.9868 20C39.9868 31.0311 31.0385 39.9734 20.0001 39.9734C8.96176 39.9734 0.0134277 31.0311 0.0134277 20C0.0134277 8.969 8.96176 0.0266113 20.0001 0.0266113C31.0385 0.0266113 39.9868 8.969 39.9868 20ZM14.3364 27.9484H10.4576C9.64253 27.9484 9.23993 27.9484 8.99444 27.7915C8.72929 27.6197 8.56727 27.3351 8.54763 27.021C8.53289 26.7317 8.73422 26.3783 9.13683 25.6717L18.7142 8.80148C19.1217 8.08509 19.3279 7.7269 19.5882 7.59443C19.868 7.45214 20.2019 7.45214 20.4818 7.59443C20.742 7.7269 20.9482 8.08509 21.3557 8.80148L23.3246 12.2362L23.3347 12.2537C23.7748 13.0222 23.998 13.412 24.0955 13.821C24.2035 14.2675 24.2035 14.7386 24.0955 15.1851C23.9973 15.5972 23.7764 15.9898 23.3295 16.7699L18.2988 25.657L18.2858 25.6797C17.8427 26.4546 17.6182 26.8474 17.307 27.1436C16.9682 27.4676 16.5607 27.7029 16.1139 27.8357C15.7063 27.9484 15.2497 27.9484 14.3364 27.9484ZM24.1318 27.9484H29.6898C30.5097 27.9484 30.9222 27.9484 31.1679 27.7867C31.433 27.6149 31.5998 27.3253 31.6147 27.0114C31.6288 26.7314 31.4319 26.3918 31.046 25.7263C31.0327 25.7036 31.0194 25.6805 31.0058 25.6571L28.2218 20.8976L28.1901 20.844C27.7989 20.1829 27.6014 19.8491 27.3478 19.72C27.0681 19.5777 26.7389 19.5777 26.4591 19.72C26.2038 19.8525 25.9976 20.2009 25.5901 20.9025L22.816 25.662L22.8065 25.6784C22.4004 26.3789 22.1974 26.729 22.212 27.0162C22.2317 27.3303 22.3937 27.6197 22.6588 27.7915C22.8994 27.9484 23.3119 27.9484 24.1318 27.9484Z"
          fill="#E84142"
        />
      </g>
      <defs>
        <clipPath id="clip0_12941_55236">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function CosmosIcon() {
  return (
    <svg
      width="45"
      height="44"
      viewBox="0 0 45 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_12985_3382)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.5 0.0422363C34.6269 0.0422363 44.4579 9.87306 44.4579 22C44.4579 34.1269 34.6269 43.9579 22.5 43.9579C10.3731 43.9579 0.542236 34.1269 0.542236 22C0.542236 9.87306 10.3731 0.0422363 22.5 0.0422363Z"
          fill="#171717"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.4578 9.33203C29.4541 9.33203 35.1257 15.0037 35.1257 22C35.1257 28.9963 29.4541 34.668 22.4578 34.668C15.4615 34.668 9.78979 28.9963 9.78979 22C9.78979 15.0037 15.4615 9.33203 22.4578 9.33203Z"
          fill="black"
        />
        <path
          opacity="0.67"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.845 3.79808C22.6705 3.63756 22.5805 3.63452 22.5654 3.63452C22.5502 3.63452 22.4602 3.63756 22.2858 3.79808C22.1068 3.96286 21.8927 4.24716 21.6621 4.68584C21.2018 5.56141 20.7613 6.88485 20.3815 8.59251C19.9545 10.5129 19.6172 12.8601 19.4043 15.4876C20.4324 15.9851 21.4896 16.5259 22.5651 17.1066C23.6408 16.5258 24.6982 15.9849 25.7265 15.4873C25.5136 12.86 25.1762 10.5128 24.7492 8.59251C24.3695 6.88485 23.9289 5.56141 23.4687 4.68584C23.238 4.24716 23.024 3.96286 22.845 3.79808ZM21.6653 17.5995C20.8755 17.1798 20.0974 16.7828 19.3355 16.4099C19.2777 17.2557 19.2328 18.1277 19.2015 19.0211C19.6045 18.7798 20.0133 18.5394 20.4277 18.3003C20.842 18.0612 21.2547 17.8276 21.6653 17.5995ZM18.5748 15.0927C19.1919 7.88761 20.7459 2.77515 22.5654 2.77515C24.3849 2.77515 25.9389 7.88748 26.5559 15.0924C33.1079 12.0241 38.315 10.813 39.2247 12.3877C40.1345 13.9625 36.4813 17.8636 30.5463 22.0001C36.4813 26.1366 40.1345 30.0377 39.2247 31.6125C38.315 33.1872 33.1079 31.9761 26.5559 28.9078C25.9389 36.1127 24.3849 41.225 22.5654 41.225C20.7459 41.225 19.1919 36.1126 18.5748 28.9075C12.0226 31.976 6.81526 33.1873 5.90549 31.6125C4.99571 30.0377 8.64887 26.1366 14.5839 22.0001C8.64887 17.8636 4.99571 13.9625 5.90549 12.3877C6.81526 10.8129 12.0226 12.0242 18.5748 15.0927ZM15.3412 21.4795C13.1705 19.9814 11.305 18.5156 9.85431 17.1858C8.56431 16.0033 7.63773 14.9602 7.10908 14.1241C6.84427 13.7051 6.70496 13.3777 6.65172 13.1405C6.59986 12.9095 6.64223 12.8303 6.64962 12.8176C6.65701 12.8048 6.70457 12.7284 6.93098 12.6577C7.1634 12.585 7.5169 12.5419 8.01246 12.5617C9.00151 12.6011 10.3688 12.8815 12.0385 13.4067C13.9162 13.9974 16.1189 14.879 18.5023 16.0085C18.4194 17.1469 18.3594 18.3322 18.3249 19.5531C17.2838 20.1936 16.2864 20.8383 15.3412 21.4795ZM15.3412 22.5207C13.1705 24.0188 11.305 25.4846 9.85431 26.8144C8.56431 27.9969 7.63773 29.04 7.10908 29.8761C6.84427 30.2951 6.70496 30.6225 6.65172 30.8597C6.59986 31.0907 6.64223 31.1698 6.64962 31.1826C6.65697 31.1954 6.70449 31.2718 6.93098 31.3425C7.1634 31.4152 7.5169 31.4582 8.01246 31.4385C9.00151 31.3991 10.3688 31.1187 12.0385 30.5934C13.9162 30.0028 16.1189 29.1212 18.5023 27.9917C18.4194 26.8533 18.3594 25.668 18.3249 24.447C17.2838 23.8065 16.2864 23.1619 15.3412 22.5207ZM18.3021 23.4219C17.5434 22.9481 16.8102 22.4731 16.1059 22.0001C16.8102 21.5271 17.5434 21.0521 18.3021 20.5783C18.2945 21.0478 18.2906 21.5219 18.2906 22.0001C18.2906 22.4783 18.2945 22.9524 18.3021 23.4219ZM19.1721 23.9578C19.1575 23.3146 19.15 22.6615 19.15 22.0001C19.15 21.3387 19.1575 20.6856 19.1721 20.0424C19.7221 19.7082 20.2842 19.3753 20.8572 19.0447C21.4304 18.7139 22.0003 18.3938 22.5651 18.0847C23.1299 18.3938 23.6998 18.7139 24.273 19.0447C24.8462 19.3754 25.4085 19.7085 25.9587 20.0428C25.9733 20.6859 25.9808 21.3388 25.9808 22.0001C25.9808 22.6613 25.9733 23.3143 25.9587 23.9574C25.4085 24.2917 24.8462 24.6248 24.273 24.9555C23.6998 25.2863 23.1299 25.6064 22.5651 25.9154C22.0003 25.6064 21.4304 25.2863 20.8572 24.9555C20.2842 24.6249 19.7221 24.292 19.1721 23.9578ZM19.2015 24.9791C19.2328 25.8725 19.2777 26.7444 19.3355 27.5903C20.0974 27.2174 20.8755 26.8203 21.6653 26.4007C21.2547 26.1726 20.842 25.939 20.4277 25.6999C20.0133 25.4608 19.6045 25.2204 19.2015 24.9791ZM22.5651 26.8936C21.4896 27.4743 20.4324 28.0151 19.4043 28.5126C19.6172 31.1401 19.9545 33.4873 20.3815 35.4076C20.7613 37.1153 21.2018 38.4388 21.6621 39.3144C21.8927 39.753 22.1068 40.0373 22.2858 40.2021C22.4602 40.3626 22.5502 40.3657 22.5654 40.3657C22.5805 40.3657 22.6705 40.3626 22.845 40.2021C23.024 40.0373 23.238 39.753 23.4687 39.3144C23.9289 38.4388 24.3695 37.1153 24.7492 35.4076C25.1762 33.4874 25.5136 31.1402 25.7265 28.5128C24.6982 28.0153 23.6408 27.4744 22.5651 26.8936ZM26.6285 27.992C29.0116 29.1214 31.2142 30.0029 33.0917 30.5934C34.7615 31.1187 36.1287 31.3991 37.1178 31.4385C37.6133 31.4582 37.9668 31.4152 38.1993 31.3425C38.4257 31.2718 38.4732 31.1954 38.4806 31.1826C38.488 31.1699 38.5304 31.0908 38.4785 30.8597C38.4253 30.6225 38.286 30.2951 38.0211 29.8761C37.4925 29.04 36.5659 27.9969 35.2759 26.8144C33.8252 25.4846 31.9597 24.0188 29.7891 22.5207C28.844 23.1618 27.8467 23.8063 26.8059 24.4467C26.7714 25.6679 26.7114 26.8534 26.6285 27.992ZM29.7891 21.4795C31.9597 19.9814 33.8252 18.5156 35.2759 17.1858C36.5659 16.0033 37.4925 14.9602 38.0211 14.1241C38.286 13.7051 38.4253 13.3777 38.4785 13.1405C38.5304 12.9094 38.488 12.8303 38.4806 12.8176C38.4732 12.8048 38.4257 12.7284 38.1993 12.6577C37.9668 12.585 37.6133 12.5419 37.1178 12.5617C36.1287 12.6011 34.7615 12.8815 33.0917 13.4067C31.2142 13.9973 29.0116 14.8788 26.6285 16.0082C26.7114 17.1468 26.7714 18.3323 26.8059 19.5535C27.8467 20.1939 28.844 20.8384 29.7891 21.4795ZM26.8286 20.5786C27.5872 21.0523 28.3202 21.5272 29.0243 22.0001C28.3202 22.473 27.5872 22.9479 26.8286 23.4215C26.8363 22.9522 26.8402 22.4782 26.8402 22.0001C26.8402 21.522 26.8363 21.048 26.8286 20.5786ZM25.9293 19.0214C25.898 18.1278 25.853 17.2557 25.7952 16.4096C25.0332 16.7827 24.2549 17.1797 23.4649 17.5995C23.8755 17.8276 24.2882 18.0612 24.7025 18.3003C25.1171 18.5395 25.5261 18.78 25.9293 19.0214ZM25.7952 27.5906C25.0332 27.2175 24.2549 26.8205 23.4649 26.4007C23.8755 26.1726 24.2882 25.939 24.7025 25.6999C25.1171 25.4607 25.5261 25.2202 25.9293 24.9788C25.898 25.8724 25.853 26.7445 25.7952 27.5906Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.2774 16.6161C11.0241 16.6161 11.6293 17.2216 11.6293 17.9686C11.6293 18.7156 11.0241 19.3212 10.2774 19.3212C9.53079 19.3212 8.92554 18.7156 8.92554 17.9686C8.92554 17.2216 9.53079 16.6161 10.2774 16.6161Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M31.7635 11.9844C32.5104 11.9844 33.116 12.5899 33.116 13.3369C33.116 14.084 32.5104 14.6895 31.7635 14.6895C31.0164 14.6895 30.4109 14.084 30.4109 13.3369C30.4109 12.5899 31.0164 11.9844 31.7635 11.9844Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.8411 33.2137C20.5881 33.2137 21.1937 33.819 21.1937 34.5657C21.1937 35.3123 20.5881 35.9176 19.8411 35.9176C19.0941 35.9176 18.4885 35.3123 18.4885 34.5657C18.4885 33.819 19.0941 33.2137 19.8411 33.2137Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.4899 19.7C23.7546 19.7 24.7799 20.7252 24.7799 21.9899C24.7799 23.2546 23.7546 24.2799 22.4899 24.2799C21.2252 24.2799 20.2 23.2546 20.2 21.9899C20.2 20.7252 21.2252 19.7 22.4899 19.7Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_12985_3382">
          <rect
            width="44"
            height="44"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
