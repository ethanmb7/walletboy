export const UNKNOWN_ICON_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM10.9645 15.3015C10.9645 15.7984 11.3677 16.2015 11.8645 16.2015C12.3612 16.2015 12.7645 15.7984 12.7645 15.3015C12.7645 14.8047 12.3612 14.4015 11.8645 14.4015C11.3677 14.4015 10.9645 14.8047 10.9645 15.3015ZM13.3939 11.8791C13.9135 11.5085 14.2656 11.1748 14.4511 10.8777C14.8776 10.1948 14.8728 9.02088 14.0532 8.35291C12.9367 7.44383 10.8943 7.77224 9.6001 8.49763L10.2067 9.7155C10.9189 9.35193 11.553 9.17 12.1092 9.17C12.6546 9.17 13.1214 9.36453 13.1214 9.91004C13.1214 10.4891 12.6543 10.8231 12.1713 11.1684L12.171 11.1686L12.1645 11.173C11.9915 11.2996 11.8416 11.4235 11.7147 11.5442C11.5451 11.7059 11.4168 11.8621 11.3298 12.013C11.1013 12.4085 11.1014 12.736 11.1019 13.152V13.2015H12.5761L12.576 13.158C12.5755 12.6312 12.5753 12.4844 13.3939 11.8791ZM20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z' fill='%238F929E'/%3E%3C/svg%3E";

export function QuestionIcon({ fill = "#A1A1AA", ...props }) {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M28.335 5C15.4677 5 5 15.4677 5 28.335C5 41.2023 15.4677 51.67 28.335 51.67C41.2023 51.67 51.67 41.2023 51.67 28.335C51.67 15.4677 41.2023 5 28.335 5ZM27.3627 41.9471C25.7526 41.9471 24.4458 40.6403 24.4458 39.0302C24.4458 37.4201 25.7526 36.1133 27.3627 36.1133C28.9728 36.1133 30.2796 37.4201 30.2796 39.0302C30.2796 40.6403 28.9728 41.9471 27.3627 41.9471ZM35.7458 24.6928C35.1449 25.6554 34.0035 26.7366 32.3195 27.9383C29.5951 29.9529 29.669 30.4001 29.669 32.2242H24.8911C24.8911 30.7988 24.86 29.704 25.6301 28.3719C26.1221 27.5183 27.0244 26.6102 28.335 25.6495C29.9082 24.5256 31.4366 23.4424 31.4366 21.5562C31.4366 19.7886 29.9237 19.1585 28.1561 19.1585C26.3535 19.1585 24.298 19.7477 21.9898 20.9261L20.0239 16.9786C24.2183 14.6276 30.8377 13.5639 34.4565 16.51C37.1128 18.6743 37.1284 22.4799 35.7458 24.6928Z"
        fill={fill}
      />
    </svg>
  );
}

export function WarningIcon({ fill = "#A1A1AA", ...props }) {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.43 47.8421H45.57C49.1633 47.8421 51.4033 43.9454 49.6067 40.8421L32.0367 10.4854C30.24 7.3821 25.76 7.3821 23.9633 10.4854L6.39333 40.8421C4.59666 43.9454 6.83666 47.8421 10.43 47.8421ZM28 31.5088C26.7167 31.5088 25.6667 30.4588 25.6667 29.1754V24.5088C25.6667 23.2254 26.7167 22.1754 28 22.1754C29.2833 22.1754 30.3333 23.2254 30.3333 24.5088V29.1754C30.3333 30.4588 29.2833 31.5088 28 31.5088ZM30.3333 40.8421H25.6667V36.1754H30.3333V40.8421Z"
        fill={fill}
      />
    </svg>
  );
}

export function WidgetIcon({ fill = "#FAFAFA" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5001 5.17497L19.3301 8.00497L16.5001 10.835L13.6701 8.00497L16.5001 5.17497ZM8.84009 5.65497V9.65497H4.84009V5.65497H8.84009ZM18.8401 15.655V19.655H14.8401V15.655H18.8401ZM8.84009 15.655V19.655H4.84009V15.655H8.84009ZM16.5001 2.34497L10.8401 7.99497L16.5001 13.655L22.1601 7.99497L16.5001 2.34497ZM10.8401 3.65497H2.84009V11.655H10.8401V3.65497ZM20.8401 13.655H12.8401V21.655H20.8401V13.655ZM10.8401 13.655H2.84009V21.655H10.8401V13.655Z"
        fill={fill}
      />
    </svg>
  );
}

export function TwitterIcon({
  fill = "#FAFAFA",
  style,
}: {
  fill?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M7.548 21.9012C16.6044 21.9012 21.558 14.3976 21.558 7.89117C21.558 7.67757 21.558 7.46517 21.5436 7.25517C22.5074 6.55741 23.3392 5.69351 24 4.70397C23.1013 5.10238 22.1479 5.36369 21.1716 5.47917C22.1996 4.86364 22.9689 3.89559 23.3364 2.75517C22.37 3.32864 21.3128 3.73285 20.2104 3.95037C19.4681 3.16049 18.486 2.63737 17.4164 2.46202C16.3467 2.28666 15.249 2.46885 14.2933 2.98038C13.3377 3.4919 12.5773 4.30422 12.13 5.29157C11.6826 6.27891 11.5732 7.38619 11.8188 8.44197C9.86111 8.34386 7.94592 7.83516 6.19757 6.94889C4.44923 6.06263 2.90679 4.8186 1.6704 3.29757C1.04078 4.38142 0.847907 5.66448 1.13104 6.88553C1.41418 8.10658 2.15204 9.17383 3.1944 9.86997C2.41112 9.84725 1.64478 9.63653 0.96 9.25557V9.31797C0.960467 10.4547 1.35407 11.5563 2.07408 12.436C2.79408 13.3157 3.79616 13.9192 4.9104 14.1444C4.18537 14.342 3.42467 14.3708 2.6868 14.2284C3.00139 15.2069 3.61401 16.0627 4.43895 16.6759C5.26389 17.2891 6.25989 17.6291 7.2876 17.6484C6.26654 18.4507 5.09734 19.0438 3.84687 19.3938C2.5964 19.7439 1.28919 19.844 0 19.6884C2.25193 21.1336 4.87223 21.9001 7.548 21.8964"
        fill={fill}
      />
    </svg>
  );
}

export function DiscordIcon({
  fill = "#FAFAFA",
  style,
}: {
  fill?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 71 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <g clipPath="url(#clip0)">
        <path
          d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="71" height="55" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export const ContactsIcon = ({
  fill = "#FAFAFA",
  style,
}: {
  fill?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <svg
      style={style}
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 21.6992C9.85005 21.6992 9.70405 21.6742 9.56205 21.6242C9.42072 21.5742 9.30005 21.4992 9.20005 21.3992L6.90005 19.0992H3.07505C2.44172 19.0992 1.90438 18.8786 1.46305 18.4372C1.02105 17.9952 0.800049 17.4576 0.800049 16.8242V2.97422C0.800049 2.34089 1.02105 1.80322 1.46305 1.36122C1.90438 0.919885 2.44172 0.699219 3.07505 0.699219H16.925C17.5584 0.699219 18.0961 0.919885 18.538 1.36122C18.9794 1.80322 19.2001 2.34089 19.2001 2.97422V16.8242C19.2001 17.4576 18.9794 17.9952 18.538 18.4372C18.0961 18.8786 17.5584 19.0992 16.925 19.0992H13.075L10.8 21.3992C10.6834 21.4992 10.5544 21.5742 10.413 21.6242C10.271 21.6742 10.1334 21.6992 10 21.6992ZM10 11.0242C10.9834 11.0242 11.821 10.6782 12.513 9.98622C13.2044 9.29489 13.55 8.45755 13.55 7.47422C13.55 6.49089 13.2044 5.65355 12.513 4.96222C11.821 4.27022 10.9834 3.92422 10 3.92422C9.01672 3.92422 8.17938 4.27022 7.48805 4.96222C6.79605 5.65355 6.45005 6.49089 6.45005 7.47422C6.45005 8.45755 6.79605 9.29489 7.48805 9.98622C8.17938 10.6782 9.01672 11.0242 10 11.0242ZM10 18.6242L12.425 16.8242H16.925V15.5492C16.025 14.6826 14.9917 14.0076 13.825 13.5242C12.6584 13.0409 11.3834 12.7992 10 12.7992C8.61672 12.7992 7.34172 13.0409 6.17505 13.5242C5.00838 14.0076 3.97505 14.6826 3.07505 15.5492V16.8242H7.55005L10 18.6242Z"
        fill={fill}
      />
    </svg>
  );
};

export function CashIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.7999 4.80005C3.47442 4.80005 2.3999 5.87457 2.3999 7.20005V12C2.3999 13.3255 3.47442 14.4 4.7999 14.4L4.7999 7.20005H16.7999C16.7999 5.87457 15.7254 4.80005 14.3999 4.80005H4.7999Z"
        fill="#FAFAFA"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.1999 12C7.1999 10.6746 8.27442 9.60005 9.5999 9.60005H19.1999C20.5254 9.60005 21.5999 10.6746 21.5999 12V16.8C21.5999 18.1255 20.5254 19.2 19.1999 19.2H9.5999C8.27442 19.2 7.1999 18.1255 7.1999 16.8V12ZM14.3999 16.8C15.7254 16.8 16.7999 15.7255 16.7999 14.4C16.7999 13.0746 15.7254 12 14.3999 12C13.0744 12 11.9999 13.0746 11.9999 14.4C11.9999 15.7255 13.0744 16.8 14.3999 16.8Z"
        fill="#FAFAFA"
      />
    </svg>
  );
}

export function SuccessIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.0001 4.66675C15.1201 4.66675 4.66675 15.1201 4.66675 28.0001C4.66675 40.8801 15.1201 51.3334 28.0001 51.3334C40.8801 51.3334 51.3334 40.8801 51.3334 28.0001C51.3334 15.1201 40.8801 4.66675 28.0001 4.66675ZM21.6767 38.0101L13.3001 29.6334C12.3901 28.7234 12.3901 27.2534 13.3001 26.3434C14.2101 25.4334 15.6801 25.4334 16.5901 26.3434L23.3334 33.0634L39.3867 17.0101C40.2967 16.1001 41.7668 16.1001 42.6768 17.0101C43.5868 17.9201 43.5868 19.3901 42.6768 20.3001L24.9667 38.0101C24.0801 38.9201 22.5867 38.9201 21.6767 38.0101Z"
        fill="#A1A1AA"
      />
    </svg>
  );
}

export function CheckIcon({
  fill = "#35A63A",
  style,
}: {
  fill?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={style}>
      <rect width="48" height="48" rx="24" fill={fill} />
      <path
        d="M20 29.5598L14.44 23.9998L12.5466 25.8798L20 33.3331L36 17.3331L34.12 15.4531L20 29.5598Z"
        fill="white"
      />
    </svg>
  );
}

export function CrossIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="24" fill="#E95050" />
      <path
        d="M33.3334 16.547L31.4534 14.667L24.0001 22.1203L16.5467 14.667L14.6667 16.547L22.1201 24.0003L14.6667 31.4537L16.5467 33.3337L24.0001 25.8803L31.4534 33.3337L33.3334 31.4537L25.8801 24.0003L33.3334 16.547Z"
        fill="white"
      />
    </svg>
  );
}

export function HardwareWalletIcon({ fill = "#A1A1AA", ...props }) {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M42 9.33325H14C8.84332 9.33325 4.66666 13.5099 4.66666 18.6666V37.3333C4.66666 42.4899 8.84332 46.6666 14 46.6666H42C47.1567 46.6666 51.3333 42.4899 51.3333 37.3333V18.6666C51.3333 13.5099 47.1567 9.33325 42 9.33325ZM37.66 32.1299C37.1 32.5966 36.33 32.7833 35.6067 32.5966L9.68332 26.2499C10.3833 24.5466 12.04 23.3333 14 23.3333H42C43.5633 23.3333 44.94 24.1266 45.8033 25.2933L37.66 32.1299ZM14 13.9999H42C44.5667 13.9999 46.6667 16.0999 46.6667 18.6666V19.9499C45.29 19.1566 43.7033 18.6666 42 18.6666H14C12.2967 18.6666 10.71 19.1566 9.33332 19.9499V18.6666C9.33332 16.0999 11.4333 13.9999 14 13.9999Z"
        fill={fill}
      />
    </svg>
  );
}

export function SolanaIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
        fill="black"
      />
      <path
        d="M55.5 28C55.5 43.1878 43.1878 55.5 28 55.5C12.8122 55.5 0.5 43.1878 0.5 28C0.5 12.8122 12.8122 0.5 28 0.5C43.1878 0.5 55.5 12.8122 55.5 28Z"
        stroke="white"
        strokeOpacity="0.15"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.2789 35.7183C17.3843 35.6023 17.5127 35.5098 17.6559 35.4464C17.799 35.3829 17.954 35.3502 18.1105 35.35L43.7697 35.371C43.8791 35.3713 43.9859 35.4032 44.0773 35.463C44.1689 35.5228 44.241 35.6079 44.2849 35.7079C44.329 35.8078 44.343 35.9186 44.3254 36.0264C44.3077 36.1342 44.2592 36.2346 44.1855 36.3153L38.7213 42.3318C38.6159 42.4478 38.4874 42.5404 38.3442 42.6039C38.2008 42.6673 38.0458 42.7 37.889 42.7L12.2305 42.6791C12.1213 42.6788 12.0144 42.6468 11.9229 42.5871C11.8315 42.5273 11.7594 42.4422 11.7153 42.3422C11.6713 42.2422 11.6572 42.1315 11.6749 42.0237C11.6925 41.9159 11.7411 41.8155 11.8147 41.7348L17.2789 35.7183ZM44.1855 30.7097C44.2592 30.7905 44.3077 30.8909 44.3254 30.9987C44.343 31.1065 44.329 31.2172 44.2849 31.3172C44.241 31.4172 44.1689 31.5023 44.0773 31.5621C43.9859 31.6218 43.8791 31.6538 43.7697 31.654L18.1112 31.675C17.9546 31.675 17.7996 31.6423 17.6562 31.5789C17.5128 31.5154 17.3843 31.4228 17.2789 31.3068L11.8147 25.2868C11.7411 25.2061 11.6925 25.1057 11.6749 24.9979C11.6572 24.8901 11.6713 24.7793 11.7153 24.6794C11.7594 24.5794 11.8315 24.4943 11.9229 24.4345C12.0144 24.3747 12.1213 24.3428 12.2305 24.3425L37.8897 24.3215C38.0464 24.3217 38.2012 24.3544 38.3444 24.4179C38.4877 24.4813 38.616 24.5738 38.7213 24.6897L44.1855 30.7097ZM17.2789 13.6682C17.3843 13.5524 17.5127 13.4598 17.6559 13.3964C17.799 13.333 17.954 13.3001 18.1105 13.3L43.7697 13.321C43.8791 13.3213 43.9859 13.3532 44.0773 13.413C44.1689 13.4728 44.241 13.5579 44.2849 13.6579C44.329 13.7579 44.343 13.8685 44.3254 13.9764C44.3077 14.0842 44.2592 14.1846 44.1855 14.2653L38.7213 20.2818C38.6159 20.3978 38.4874 20.4904 38.3442 20.5539C38.2008 20.6173 38.0458 20.65 37.889 20.65L12.2305 20.629C12.1213 20.6288 12.0144 20.5968 11.9229 20.5371C11.8315 20.4773 11.7594 20.3922 11.7153 20.2922C11.6713 20.1922 11.6572 20.0815 11.6749 19.9737C11.6925 19.8659 11.7411 19.7655 11.8147 19.6847L17.2789 13.6682Z"
        fill="url(#paint0_linear_5897_33336)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_5897_33336"
          x1="12.6589"
          y1="43.3412"
          x2="43.3413"
          y2="12.6588"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9945FF" />
          <stop offset="0.2" stopColor="#7962E7" />
          <stop offset="1" stopColor="#00D18C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function EthereumIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" id="body_1" width="56" height="56">
      <g transform="matrix(1.6470588 0 0 1.6470588 0 0)">
        <path
          d="M17 34C 26.3888 34 34 26.3888 34 17C 34 7.61116 26.3888 0 17 0C 7.61116 0 0 7.61116 0 17C 0 26.3888 7.61116 34 17 34z"
          stroke="none"
          fill="#627EEA"
          fillRule="nonzero"
        />
        <path
          d="M17.5293 4.25L17.5293 13.6744L25.4949 17.2337L17.5293 4.25z"
          stroke="none"
          fill="#FFFFFF"
          fillRule="nonzero"
          fillOpacity="0.6"
        />
        <path
          d="M17.5291 4.25L9.5625 17.2337L17.5291 13.6744L17.5291 4.25z"
          stroke="none"
          fill="#FFFFFF"
          fillRule="nonzero"
        />
        <path
          d="M17.5293 23.3408L17.5293 29.7445L25.5002 18.7168L17.5293 23.3408z"
          stroke="none"
          fill="#FFFFFF"
          fillRule="nonzero"
          fillOpacity="0.6"
        />
        <path
          d="M17.5291 29.7445L17.5291 23.3397L9.5625 18.7168L17.5291 29.7445z"
          stroke="none"
          fill="#FFFFFF"
          fillRule="nonzero"
        />
        <path
          d="M17.5293 21.8581L25.4949 17.233L17.5293 13.6758L17.5293 21.8581z"
          stroke="none"
          fill="#FFFFFF"
          fillRule="nonzero"
          fillOpacity="0.2"
        />
        <path
          d="M9.5625 17.233L17.5291 21.8581L17.5291 13.6758L9.5625 17.233z"
          stroke="none"
          fill="#FFFFFF"
          fillRule="nonzero"
          fillOpacity="0.6"
        />
      </g>
    </svg>
  );
}

export function SadFaceIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M36.1666 25.6667C38.0996 25.6667 39.6666 24.0997 39.6666 22.1667C39.6666 20.2338 38.0996 18.6667 36.1666 18.6667C34.2336 18.6667 32.6666 20.2338 32.6666 22.1667C32.6666 24.0997 34.2336 25.6667 36.1666 25.6667Z"
        fill="#A1A1AA"
      />
      <path
        d="M19.8333 25.6667C21.7663 25.6667 23.3333 24.0997 23.3333 22.1667C23.3333 20.2338 21.7663 18.6667 19.8333 18.6667C17.9003 18.6667 16.3333 20.2338 16.3333 22.1667C16.3333 24.0997 17.9003 25.6667 19.8333 25.6667Z"
        fill="#A1A1AA"
      />
      <path
        d="M27.9766 4.66675C15.0966 4.66675 4.66663 15.1201 4.66663 28.0001C4.66663 40.8801 15.0966 51.3334 27.9766 51.3334C40.88 51.3334 51.3333 40.8801 51.3333 28.0001C51.3333 15.1201 40.88 4.66675 27.9766 4.66675ZM28 46.6667C17.6866 46.6667 9.33329 38.3134 9.33329 28.0001C9.33329 17.6867 17.6866 9.33341 28 9.33341C38.3133 9.33341 46.6666 17.6867 46.6666 28.0001C46.6666 38.3134 38.3133 46.6667 28 46.6667ZM28 32.6667C23.5666 32.6667 19.53 34.9301 17.15 38.6867C16.6366 39.5034 16.8933 40.5767 17.71 41.0901C18.5266 41.6034 19.6 41.3467 20.1133 40.5301C21.84 37.7767 24.78 36.1434 28 36.1434C31.22 36.1434 34.16 37.7767 35.8866 40.5301C36.2133 41.0667 36.7966 41.3467 37.38 41.3467C37.7066 41.3467 38.01 41.2534 38.3133 41.0901C39.13 40.5767 39.3866 39.5034 38.8733 38.6867C36.47 34.9067 32.4333 32.6667 28 32.6667Z"
        fill="#A1A1AA"
      />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.0003 10.7834C24.6003 10.7834 28.3337 14.5167 28.3337 19.1167C28.3337 19.9667 28.167 20.7834 27.9337 21.5501L33.0337 26.6501C35.3503 24.6001 37.1837 22.0334 38.3337 19.1001C35.4503 11.8001 28.3337 6.61675 20.0003 6.61675C17.8837 6.61675 15.8503 6.95008 13.9337 7.56675L17.5503 11.1834C18.3337 10.9501 19.1503 10.7834 20.0003 10.7834ZM4.51699 5.21675C3.86699 5.86675 3.86699 6.91675 4.51699 7.56675L7.80032 10.8501C5.10032 13.0001 2.95033 15.8334 1.66699 19.1167C4.55033 26.4334 11.667 31.6167 20.0003 31.6167C22.5337 31.6167 24.9503 31.1167 27.1837 30.2501L31.717 34.7834C32.367 35.4334 33.417 35.4334 34.067 34.7834C34.717 34.1334 34.717 33.0834 34.067 32.4334L6.88366 5.21675C6.23366 4.56675 5.16699 4.56675 4.51699 5.21675ZM20.0003 27.4501C15.4003 27.4501 11.667 23.7167 11.667 19.1167C11.667 17.8334 11.967 16.6167 12.4837 15.5501L15.1003 18.1667C15.0503 18.4667 15.0003 18.7834 15.0003 19.1167C15.0003 21.8834 17.2337 24.1167 20.0003 24.1167C20.3337 24.1167 20.6337 24.0667 20.9503 24.0001L23.567 26.6167C22.4837 27.1501 21.2837 27.4501 20.0003 27.4501ZM24.9503 18.5667C24.7003 16.2334 22.867 14.4167 20.5503 14.1667L24.9503 18.5667Z"
        fill="#A1A1AA"
      />
    </svg>
  );
}

export function BalancesIcon({ fill = "#99A4B4", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path d="M15.7664 5L18.7664 0H5.23438L8.23438 5H15.7664Z" fill={fill} />
      <path
        d="M16.416 7H7.583C5.416 9.305 2 13.492 2 17C2 19.1 2.975 24 12 24C21.025 24 22 19.1 22 17C22 13.492 18.582 9.305 16.416 7Z"
        fill={fill}
      />
    </svg>
  );
}

export function GridIcon({ fill = "#99A4B4", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M9 1H3C1.89543 1 1 1.89543 1 3V9C1 10.1046 1.89543 11 3 11H9C10.1046 11 11 10.1046 11 9V3C11 1.89543 10.1046 1 9 1Z"
        fill={fill}
      />
      <path
        d="M23.4285 4.61798L19.3815 0.571977C19.0147 0.206683 18.5182 0.00158691 18.0005 0.00158691C17.4829 0.00158691 16.9863 0.206683 16.6195 0.571977L12.5725 4.61798C12.2071 4.9851 12.002 5.48199 12.002 5.99998C12.002 6.51796 12.2071 7.01486 12.5725 7.38198L16.6195 11.429C16.9863 11.7943 17.4829 11.9994 18.0005 11.9994C18.5182 11.9994 19.0147 11.7943 19.3815 11.429L23.4285 7.38298C23.7942 7.01582 23.9996 6.5187 23.9996 6.00048C23.9996 5.48225 23.7942 4.98514 23.4285 4.61798Z"
        fill={fill}
      />
      <path
        d="M21 13H15C13.8954 13 13 13.8954 13 15V21C13 22.1046 13.8954 23 15 23H21C22.1046 23 23 22.1046 23 21V15C23 13.8954 22.1046 13 21 13Z"
        fill={fill}
      />
      <path
        d="M9 13H3C1.89543 13 1 13.8954 1 15V21C1 22.1046 1.89543 23 3 23H9C10.1046 23 11 22.1046 11 21V15C11 13.8954 10.1046 13 9 13Z"
        fill={fill}
      />
    </svg>
  );
}

export function ImageIcon({ fill = "#99A4B4", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M20 1H4C3.20435 1 2.44129 1.31607 1.87868 1.87868C1.31607 2.44129 1 3.20435 1 4V20C1 20.7956 1.31607 21.5587 1.87868 22.1213C2.44129 22.6839 3.20435 23 4 23H20C20.7956 23 21.5587 22.6839 22.1213 22.1213C22.6839 21.5587 23 20.7956 23 20V4C23 3.20435 22.6839 2.44129 22.1213 1.87868C21.5587 1.31607 20.7956 1 20 1V1ZM9.5 6C9.79667 6 10.0867 6.08797 10.3334 6.2528C10.58 6.41762 10.7723 6.65189 10.8858 6.92597C10.9994 7.20006 11.0291 7.50166 10.9712 7.79264C10.9133 8.08361 10.7704 8.35088 10.5607 8.56066C10.3509 8.77044 10.0836 8.9133 9.79264 8.97118C9.50166 9.02906 9.20006 8.99935 8.92597 8.88582C8.65189 8.77229 8.41762 8.58003 8.2528 8.33335C8.08797 8.08668 8 7.79667 8 7.5C8 7.10218 8.15804 6.72064 8.43934 6.43934C8.72064 6.15804 9.10218 6 9.5 6ZM18.925 16.763C18.8802 16.8354 18.8177 16.8952 18.7433 16.9367C18.6689 16.9782 18.5852 17 18.5 17H5.5C5.41075 17 5.32312 16.9761 5.24622 16.9308C5.16932 16.8855 5.10594 16.8204 5.06268 16.7424C5.01941 16.6643 4.99783 16.5761 5.00017 16.4869C5.00251 16.3977 5.0287 16.3107 5.076 16.235L7.576 12.235C7.61791 12.168 7.6751 12.1119 7.74288 12.0713C7.81067 12.0306 7.88712 12.0066 7.96596 12.0013C8.04481 11.9959 8.1238 12.0093 8.19647 12.0404C8.26914 12.0714 8.3334 12.1193 8.384 12.18L10.479 14.694L14.6 9.2C14.6519 9.13248 14.7197 9.07886 14.7973 9.04396C14.875 9.00906 14.9601 8.99395 15.045 9C15.1294 9.00799 15.2105 9.03734 15.2804 9.08527C15.3504 9.1332 15.407 9.19815 15.445 9.274L18.945 16.274C18.9839 16.3504 19.0024 16.4355 18.9989 16.5211C18.9954 16.6067 18.97 16.69 18.925 16.763V16.763Z"
        fill={fill}
      />
    </svg>
  );
}

export function MessageIcon({ fill = "#99A4B4", ...props }) {
  return (
    <svg
      width="22"
      height="21"
      viewBox="0 0 22 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.5999 10.9C6.96657 10.9 7.2749 10.775 7.5249 10.525C7.7749 10.275 7.8999 9.96667 7.8999 9.6C7.8999 9.23333 7.7749 8.925 7.5249 8.675C7.2749 8.425 6.96657 8.3 6.5999 8.3C6.23324 8.3 5.9249 8.425 5.6749 8.675C5.4249 8.925 5.2999 9.23333 5.2999 9.6C5.2999 9.96667 5.4249 10.275 5.6749 10.525C5.9249 10.775 6.23324 10.9 6.5999 10.9ZM10.9999 10.9C11.3666 10.9 11.6749 10.775 11.9249 10.525C12.1749 10.275 12.2999 9.96667 12.2999 9.6C12.2999 9.23333 12.1749 8.925 11.9249 8.675C11.6749 8.425 11.3666 8.3 10.9999 8.3C10.6332 8.3 10.3249 8.425 10.0749 8.675C9.8249 8.925 9.6999 9.23333 9.6999 9.6C9.6999 9.96667 9.8249 10.275 10.0749 10.525C10.3249 10.775 10.6332 10.9 10.9999 10.9ZM15.3999 10.9C15.7666 10.9 16.0749 10.775 16.3249 10.525C16.5749 10.275 16.6999 9.96667 16.6999 9.6C16.6999 9.23333 16.5749 8.925 16.3249 8.675C16.0749 8.425 15.7666 8.3 15.3999 8.3C15.0332 8.3 14.7249 8.425 14.4749 8.675C14.2249 8.925 14.0999 9.23333 14.0999 9.6C14.0999 9.96667 14.2249 10.275 14.4749 10.525C14.7249 10.775 15.0332 10.9 15.3999 10.9ZM0.149902 18.65V3.9C0.149902 3.01667 0.453902 2.27067 1.0619 1.662C1.67057 1.054 2.41657 0.75 3.2999 0.75H18.6999C19.5832 0.75 20.3292 1.054 20.9379 1.662C21.5459 2.27067 21.8499 3.01667 21.8499 3.9V15.3C21.8499 16.1833 21.5459 16.9293 20.9379 17.538C20.3292 18.146 19.5832 18.45 18.6999 18.45H4.1499L2.8249 19.775C2.3249 20.275 1.75424 20.3877 1.1129 20.113C0.470902 19.8377 0.149902 19.35 0.149902 18.65V18.65Z"
        fill={fill}
      />
    </svg>
  );
}

export function PowerIcon({ fill = "#99A4B4" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8.88896 0H7.11125V8.88896H8.88896V0ZM13.1867 1.92437L11.929 3.18208C13.3244 4.32438 14.2223 6.05333 14.2223 8C14.2223 11.4356 11.4356 14.2223 8 14.2223C4.56437 14.2223 1.77771 11.4356 1.77771 8C1.77771 6.05333 2.67542 4.32438 4.07104 3.18229L2.81333 1.92458C1.09771 3.39104 0 5.56437 0 8C0 12.4177 3.58229 16 8 16C12.4177 16 16 12.4177 16 8C16 5.56437 14.9023 3.39104 13.1867 1.92437Z"
        fill={fill}
      />
    </svg>
  );
}

export function MoreIcon({ fill = "#99A4B4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="8"
      viewBox="0 0 20 8"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.99991 7.50012C11.9329 7.50012 13.4999 5.93312 13.4999 4.00012C13.4999 2.06713 11.9329 0.500122 9.99991 0.500122C8.06691 0.500122 6.49991 2.06713 6.49991 4.00012C6.49991 5.93312 8.06691 7.50012 9.99991 7.50012ZM4.5 4.00006C4.5 5.10463 3.60457 6.00006 2.5 6.00006C1.39543 6.00006 0.5 5.10463 0.5 4.00006C0.5 2.89549 1.39543 2.00006 2.5 2.00006C3.60457 2.00006 4.5 2.89549 4.5 4.00006ZM19.5 4.00012C19.5 5.10469 18.6046 6.00012 17.5 6.00012C16.3954 6.00012 15.5 5.10469 15.5 4.00012C15.5 2.89555 16.3954 2.00012 17.5 2.00012C18.6046 2.00012 19.5 2.89555 19.5 4.00012Z"
        fill={fill}
      />
    </svg>
  );
}

export function SwapIcon({ fill = "#99A4B4" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12ZM15 6.5L18.15 9.65C18.35 9.85 18.35 10.16 18.15 10.36L15 13.5V11H11V9H15V6.5ZM9 17.5L5.85 14.35C5.65 14.15 5.65 13.84 5.85 13.64L9 10.5V13H13V15H9V17.5Z"
        fill={fill}
      />
    </svg>
  );
}

export function ExtensionIcon({ fill = "#FAFAFA" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M16.6667 9.58333H15.4167V6.25C15.4167 5.33333 14.6667 4.58333 13.75 4.58333H10.4167V3.33333C10.4167 2.18333 9.48333 1.25 8.33333 1.25C7.18333 1.25 6.25 2.18333 6.25 3.33333V4.58333H2.91667C2 4.58333 1.25833 5.33333 1.25833 6.25V9.41667H2.5C3.74167 9.41667 4.75 10.425 4.75 11.6667C4.75 12.9083 3.74167 13.9167 2.5 13.9167H1.25V17.0833C1.25 18 2 18.75 2.91667 18.75H6.08333V17.5C6.08333 16.2583 7.09167 15.25 8.33333 15.25C9.575 15.25 10.5833 16.2583 10.5833 17.5V18.75H13.75C14.6667 18.75 15.4167 18 15.4167 17.0833V13.75H16.6667C17.8167 13.75 18.75 12.8167 18.75 11.6667C18.75 10.5167 17.8167 9.58333 16.6667 9.58333Z"
        fill={fill}
      />
    </svg>
  );
}

export function PinIcon({ fill = "#FAFAFA" }) {
  return (
    <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.33317 6.49996V2.33329H10.1665C10.6248 2.33329 10.9998 1.95829 10.9998 1.49996C10.9998 1.04163 10.6248 0.666626 10.1665 0.666626H1.83317C1.37484 0.666626 0.999837 1.04163 0.999837 1.49996C0.999837 1.95829 1.37484 2.33329 1.83317 2.33329H2.6665V6.49996C2.6665 7.88329 1.54984 8.99996 0.166504 8.99996V10.6666H5.1415V16.5L5.97484 17.3333L6.80817 16.5V10.6666H11.8332V8.99996C10.4498 8.99996 9.33317 7.88329 9.33317 6.49996Z"
        fill={fill}
      />
    </svg>
  );
}

export function Backpack({ fill }: { fill: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="41"
      viewBox="0 0 200 41"
      fill="none"
    >
      <path
        d="M2.02026 31.597V1.49499H14.748C16.8221 1.49499 18.6 1.84518 20.0815 2.54554C21.563 3.2459 22.6944 4.25603 23.4755 5.57594C24.2567 6.86892 24.6473 8.44473 24.6473 10.3034C24.6473 11.6233 24.2837 12.8893 23.5564 14.1015C22.8291 15.2867 21.6304 16.2834 19.9603 17.0915V14.0207C21.5496 14.6402 22.7752 15.381 23.6372 16.243C24.4991 17.105 25.0918 18.0478 25.415 19.0714C25.7382 20.068 25.8999 21.1186 25.8999 22.223C25.8999 25.186 24.9167 27.4892 22.9503 29.1323C20.9839 30.7755 18.2498 31.597 14.748 31.597H2.02026ZM8.2831 26.1423H15.4753C16.7413 26.1423 17.7514 25.7787 18.5057 25.0514C19.2599 24.3241 19.637 23.3813 19.637 22.223C19.637 21.0378 19.2599 20.0815 18.5057 19.3542C17.7514 18.6269 16.7413 18.2632 15.4753 18.2632H8.2831V26.1423ZM8.2831 12.8085H15.1924C16.1622 12.8085 16.9299 12.5391 17.4955 12.0004C18.0882 11.4347 18.3845 10.694 18.3845 9.77811C18.3845 8.86225 18.0882 8.13495 17.4955 7.59621C16.9299 7.03054 16.1622 6.7477 15.1924 6.7477H8.2831V12.8085Z"
        fill={fill}
      />
      <path
        d="M36.3014 32.0819C34.7121 32.0819 33.3384 31.826 32.1801 31.3142C31.0218 30.8024 30.1329 30.0751 29.5133 29.1323C28.8938 28.1626 28.584 27.0178 28.584 25.6978C28.584 24.4587 28.8668 23.3678 29.4325 22.425C29.9982 21.4553 30.8602 20.6472 32.0184 20.0007C33.2037 19.3542 34.6717 18.8963 36.4226 18.6269L43.1703 17.5359V21.9805L37.5136 22.9907C36.6516 23.1523 35.9916 23.4351 35.5337 23.8392C35.0758 24.2163 34.8468 24.7685 34.8468 25.4958C34.8468 26.1692 35.1027 26.6945 35.6145 27.0716C36.1263 27.4487 36.7594 27.6373 37.5136 27.6373C38.5103 27.6373 39.3857 27.4218 40.1399 26.9908C40.8942 26.5598 41.4733 25.9807 41.8774 25.2534C42.3084 24.4992 42.5239 23.6776 42.5239 22.7887V17.0511C42.5239 16.216 42.1871 15.5157 41.5137 14.95C40.8672 14.3843 39.9783 14.1015 38.847 14.1015C37.7695 14.1015 36.8132 14.3978 35.9782 14.9904C35.1701 15.583 34.5775 16.3642 34.2003 17.3339L29.3517 15.0308C29.7827 13.7917 30.4696 12.7277 31.4124 11.8388C32.3552 10.9499 33.4865 10.263 34.8064 9.77811C36.1263 9.29324 37.5675 9.05081 39.1298 9.05081C40.9885 9.05081 42.6316 9.38752 44.0593 10.0609C45.4869 10.7344 46.5913 11.6772 47.3725 12.8893C48.1806 14.0746 48.5847 15.4618 48.5847 17.0511V31.597H42.9279V28.0414L44.3017 27.7989C43.6552 28.7687 42.9414 29.5768 42.1602 30.2233C41.379 30.8428 40.5036 31.3007 39.5339 31.597C38.5641 31.9203 37.4866 32.0819 36.3014 32.0819Z"
        fill={fill}
      />
      <path
        d="M63.8582 32.0819C61.6494 32.0819 59.6561 31.5836 57.8782 30.5869C56.1273 29.5633 54.7266 28.176 53.6761 26.4251C52.6525 24.6742 52.1407 22.7078 52.1407 20.5259C52.1407 18.3441 52.6525 16.3911 53.6761 14.6672C54.6997 12.9163 56.1004 11.5425 57.8782 10.5458C59.6561 9.54914 61.6494 9.05081 63.8582 9.05081C65.5014 9.05081 67.0233 9.33365 68.4241 9.89933C69.8248 10.465 71.0235 11.2596 72.0201 12.2832C73.0168 13.2799 73.7306 14.4651 74.1616 15.8389L68.9089 18.1016C68.5318 16.9972 67.8853 16.1218 66.9695 15.4753C66.0805 14.8288 65.0435 14.5055 63.8582 14.5055C62.8077 14.5055 61.8649 14.7614 61.0299 15.2732C60.2218 15.785 59.5753 16.4989 59.0904 17.4147C58.6325 18.3306 58.4035 19.3811 58.4035 20.5664C58.4035 21.7516 58.6325 22.8021 59.0904 23.718C59.5753 24.6338 60.2218 25.3477 61.0299 25.8595C61.8649 26.3713 62.8077 26.6272 63.8582 26.6272C65.0704 26.6272 66.1209 26.3039 67.0099 25.6574C67.8988 25.011 68.5318 24.1355 68.9089 23.0311L74.1616 25.3342C73.7576 26.6272 73.0572 27.7855 72.0605 28.8091C71.0639 29.8327 69.8652 30.6408 68.4645 31.2334C67.0637 31.7991 65.5283 32.0819 63.8582 32.0819Z"
        fill={fill}
      />
      <path
        d="M77.7306 31.597V1.01013H83.7914V20.6068L81.5287 19.8795L91.2664 9.53568H98.7414L90.7411 18.4249L98.701 31.597H91.832L85.1651 20.4047L88.6804 19.5158L81.9327 26.8696L83.7914 23.3543V31.597H77.7306Z"
        fill={fill}
      />
      <path
        d="M101.406 39.6781V9.53568H107.062V13.7378L106.537 12.5257C107.264 11.4213 108.248 10.5727 109.487 9.98013C110.753 9.36058 112.194 9.05081 113.81 9.05081C115.911 9.05081 117.81 9.56261 119.507 10.5862C121.204 11.6098 122.551 12.9971 123.548 14.748C124.544 16.4719 125.043 18.4114 125.043 20.5664C125.043 22.6944 124.544 24.6338 123.548 26.3847C122.578 28.1356 121.245 29.5229 119.548 30.5465C117.851 31.5701 115.925 32.0819 113.77 32.0819C112.261 32.0819 110.86 31.8125 109.567 31.2738C108.301 30.7081 107.278 29.8865 106.497 28.8091L107.466 27.5565V39.6781H101.406ZM113.042 26.6272C114.174 26.6272 115.17 26.3713 116.032 25.8595C116.894 25.3477 117.568 24.6338 118.053 23.718C118.538 22.8021 118.78 21.7516 118.78 20.5664C118.78 19.3811 118.538 18.3441 118.053 17.4551C117.568 16.5393 116.894 15.8255 116.032 15.3137C115.17 14.7749 114.174 14.5055 113.042 14.5055C111.965 14.5055 110.995 14.7614 110.133 15.2732C109.298 15.785 108.638 16.4989 108.153 17.4147C107.695 18.3306 107.466 19.3811 107.466 20.5664C107.466 21.7516 107.695 22.8021 108.153 23.718C108.638 24.6338 109.298 25.3477 110.133 25.8595C110.995 26.3713 111.965 26.6272 113.042 26.6272Z"
        fill={fill}
      />
      <path
        d="M135.421 32.0819C133.832 32.0819 132.458 31.826 131.3 31.3142C130.141 30.8024 129.252 30.0751 128.633 29.1323C128.013 28.1626 127.704 27.0178 127.704 25.6978C127.704 24.4587 127.986 23.3678 128.552 22.425C129.118 21.4553 129.98 20.6472 131.138 20.0007C132.323 19.3542 133.791 18.8963 135.542 18.6269L142.29 17.5359V21.9805L136.633 22.9907C135.771 23.1523 135.111 23.4351 134.653 23.8392C134.195 24.2163 133.966 24.7685 133.966 25.4958C133.966 26.1692 134.222 26.6945 134.734 27.0716C135.246 27.4487 135.879 27.6373 136.633 27.6373C137.63 27.6373 138.505 27.4218 139.259 26.9908C140.014 26.5598 140.593 25.9807 140.997 25.2534C141.428 24.4992 141.643 23.6776 141.643 22.7887V17.0511C141.643 16.216 141.307 15.5157 140.633 14.95C139.987 14.3843 139.098 14.1015 137.967 14.1015C136.889 14.1015 135.933 14.3978 135.098 14.9904C134.29 15.583 133.697 16.3642 133.32 17.3339L128.471 15.0308C128.902 13.7917 129.589 12.7277 130.532 11.8388C131.475 10.9499 132.606 10.263 133.926 9.77811C135.246 9.29324 136.687 9.05081 138.249 9.05081C140.108 9.05081 141.751 9.38752 143.179 10.0609C144.606 10.7344 145.711 11.6772 146.492 12.8893C147.3 14.0746 147.704 15.4618 147.704 17.0511V31.597H142.047V28.0414L143.421 27.7989C142.775 28.7687 142.061 29.5768 141.28 30.2233C140.499 30.8428 139.623 31.3007 138.653 31.597C137.684 31.9203 136.606 32.0819 135.421 32.0819Z"
        fill={fill}
      />
      <path
        d="M162.978 32.0819C160.769 32.0819 158.776 31.5836 156.998 30.5869C155.247 29.5633 153.846 28.176 152.796 26.4251C151.772 24.6742 151.26 22.7078 151.26 20.5259C151.26 18.3441 151.772 16.3911 152.796 14.6672C153.819 12.9163 155.22 11.5425 156.998 10.5458C158.776 9.54914 160.769 9.05081 162.978 9.05081C164.621 9.05081 166.143 9.33365 167.544 9.89933C168.944 10.465 170.143 11.2596 171.14 12.2832C172.136 13.2799 172.85 14.4651 173.281 15.8389L168.028 18.1016C167.651 16.9972 167.005 16.1218 166.089 15.4753C165.2 14.8288 164.163 14.5055 162.978 14.5055C161.927 14.5055 160.984 14.7614 160.149 15.2732C159.341 15.785 158.695 16.4989 158.21 17.4147C157.752 18.3306 157.523 19.3811 157.523 20.5664C157.523 21.7516 157.752 22.8021 158.21 23.718C158.695 24.6338 159.341 25.3477 160.149 25.8595C160.984 26.3713 161.927 26.6272 162.978 26.6272C164.19 26.6272 165.24 26.3039 166.129 25.6574C167.018 25.011 167.651 24.1355 168.028 23.0311L173.281 25.3342C172.877 26.6272 172.177 27.7855 171.18 28.8091C170.183 29.8327 168.985 30.6408 167.584 31.2334C166.183 31.7991 164.648 32.0819 162.978 32.0819Z"
        fill={fill}
      />
      <path
        d="M176.85 31.597V1.01013H182.911V20.6068L180.648 19.8795L190.386 9.53568H197.861L189.861 18.4249L197.821 31.597H190.952L184.285 20.4047L187.8 19.5158L181.052 26.8696L182.911 23.3543V31.597H176.85Z"
        fill={fill}
      />
    </svg>
  );
}

export function RedBackpack({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="55"
      height="80"
      viewBox="0 0 55 80"
      fill="none"
      style={style}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.71 6.29026C35.6178 6.29026 38.3452 6.68005 40.8705 7.40296C38.3982 1.64085 33.2649 0 27.5519 0C21.8277 0 16.6855 1.64729 14.2188 7.43692C16.7255 6.68856 19.4412 6.29026 22.339 6.29026H32.71ZM21.6739 12.0752C7.86677 12.0752 0 22.9371 0 36.336V50.1C0 51.4399 1.11929 52.5 2.5 52.5H52.5C53.8807 52.5 55 51.4399 55 50.1V36.336C55 22.9371 45.8521 12.0752 32.0449 12.0752H21.6739ZM27.4805 36.4551C32.313 36.4551 36.2305 32.5376 36.2305 27.7051C36.2305 22.8726 32.313 18.9551 27.4805 18.9551C22.648 18.9551 18.7305 22.8726 18.7305 27.7051C18.7305 32.5376 22.648 36.4551 27.4805 36.4551ZM0 60.5901C0 59.2503 1.11929 58.1641 2.5 58.1641H52.5C53.8807 58.1641 55 59.2503 55 60.5901V75.1466C55 77.8264 52.7614 79.9988 50 79.9988H5C2.23857 79.9988 0 77.8264 0 75.1466V60.5901Z"
        fill="#E33E3F"
      />
    </svg>
  );
}

export function Dollar({
  fill,
  style,
}: {
  fill?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      style={style}
    >
      <path
        d="M5.3 7.9C3.03 7.31 2.3 6.7 2.3 5.75C2.3 4.66 3.31 3.9 5 3.9C6.42 3.9 7.13 4.44 7.39 5.3C7.51 5.7 7.84 6 8.26 6H8.56C9.22 6 9.69 5.35 9.46 4.73C9.04 3.55 8.06 2.57 6.5 2.19V1.5C6.5 0.67 5.83 0 5 0C4.17 0 3.5 0.67 3.5 1.5V2.16C1.56 2.58 0 3.84 0 5.77C0 8.08 1.91 9.23 4.7 9.9C7.2 10.5 7.7 11.38 7.7 12.31C7.7 13 7.21 14.1 5 14.1C3.35 14.1 2.5 13.51 2.17 12.67C2.02 12.28 1.68 12 1.27 12H0.99C0.32 12 -0.15 12.68 0.0999999 13.3C0.67 14.69 2 15.51 3.5 15.83V16.5C3.5 17.33 4.17 18 5 18C5.83 18 6.5 17.33 6.5 16.5V15.85C8.45 15.48 10 14.35 10 12.3C10 9.46 7.57 8.49 5.3 7.9Z"
        fill={fill}
      />
    </svg>
  );
}
