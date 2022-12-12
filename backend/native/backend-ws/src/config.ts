export const PORT = 8082;

export const CHAT_HASURA_URL =
  process.env.CHAT_HASURA_URL || "http://localhost:8113/v1/graphql";
export const CHAT_JWT =
  process.env.CHAT_JWT ||
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiY2hhdCJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJjaGF0In0sImlhdCI6MTY3MDg2NzkwN30.LI0YdKWnuCnRoJWsatcRclcruL1ojtYN7R6-zWNnpoCEz8N5pgBKaOOFFTGvcvwkG3ALo-eAAwELrBOEEVAUR7rxd5bq23rPX3eh0pkHZ0i0fLHm1o3BOcv4J_dXT2RBwcG1Y9E335L2M-N0WqlQa4Y3XnZiRkUGe0WBogqobK5vposdDiR52xKBuHuMKHo0LHQcMSJap9bSqES9BbISOW5D9qhcgm2Lbsm3HIOf7k21Hjo7bf9NpMUMbQZQS7yL0B-5bjZqNSFYnoVfGrhTMUnCM3-W4OwA8xqZuXL14jhmocBEVM-sP95G-ysxgnWniWq5OR2xRuelRJv5IocfgylMYTj64O57oLb1C7gnMcrcO_fkpJgGUEWKQb66U-JZghW4DAYljmWvlpCgfcKM7u914l9Qs-3Q2vzkzvZeTo11CfTRAX6ECfNMzGwLLxvdA_nz7eLHrBRIMz9syhPjjzYFnitlK8G2jYawlS6VmOoPAeUgUjHobmaQ9BoodJ7QpLDG789L9seXj2O57KUp3vW2Gp8NeFCHm3auzw9CwVLEn9c7wWQMHNSG22gUBYijyPle_95m_gbBvq_gdAjhwBPb9pwbXP9SCADvtvZUxUIUG7llCsbBT6ShihlTNAzgwOgxV8txEM5Pi9wG3FZdcj90LjipVCz2LiQEnwGhkoY";

export const AUTH_HASURA_URL =
  process.env.AUTH_HASURA_URL || "http://localhost:8112/v1/graphql";

export const AUTH_JWT =
  process.env.AUTH_JWT ||
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYXV0aF93b3JrZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYXV0aF93b3JrZXIifSwiaWF0IjoxNjY0MjQ3NzE2fQ.F7IMXysrX7jLs5kEekjZenixkNm8KJfzyBo4KplnSqSstWpAh4lTFNhh8Ow0bVzwphhJEPtcLMXZvYlOmwM7RcQ_8zxD-UcLPC8nru9_n-8eWO1ADwffjJ4GM7V78d-iOV3qX_bqk2L6w8Pt9XCZJ-OCvecyv1_4xndFnVO3kgOsCL78tlbw7TjiMKCKKl74Ew5mstUA7FrGolXrDvCwbeM3lHf0UJdXwTj4U18IWyEgvPWVOSJLZMRDCxhBSnKuTCkYbXkyYt_ugBg4_nAimcg116Z1MXDxC2DLK7JXh_0g11HznlUItdh7pvDIGWFQorXNIy1pY09Li6HTXBQH1oAb_wYPvZOl3Gij-P9hJkkELjmIqDlQhG9ccgPtATf62yMN5huc2fpsrqSx0e0B65XC4g8xVlXMHhxpyDrbjJ0hyBwdez5gBMOF5EWl3slzRPrmRtzMiciSPV9l44sOnD0P4-1nyjllL9v0bIPAtt-rK3ZYtKiIp-XJIOjG1jJ4K6J13jBFt5uvqoXLfxKMQSiBhp40jU4Yqjo0C_6lUkpaC5gOF9BTe8JbuDobdBGqK_gr9vJMUrGb4_LROieO6vtj6ts1mG2k3F0rpxuHMwTZIx2DuHUXXswJK7J6OXLjGFi1QjIzukfXmoBplLuqxsqLzOLH6Kxv0_WIjrkLcwA";

export const AUTH_JWT_PUBLIC_KEY =
  process.env.AUTH_JWT_PUBLIC_KEY ||
  "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqx+7XJxJR+0Lp8hLFKYr5Gc+0RPIdaZJ18GH8b//oMn7PCVe0gLQDkxjvhKo2ySMgWSOSGaNJkZXLhN4jlot/xaulN3dSbrgQPxvx3ALd3nXJaTLOb7xBODd196r+Ylg1QPICdrBQVi6qAXacq/UBK8K7BWQ0TG2/R9aB5mNSGtY3Ogj9xp2MP5LTi7f2Alj6IwSFRN+9SCmH3NiQzNUPBWJB02Lgx1oxwtfevkQ3BpwIqzkOTTE1G7PXgKbYRBUlUNqwvMIjk89tRf/qHgMbRPGYYNu7XoRt8AOVgNFUcL51Gb9vM75XstWoAh6BwYQsceEXUU7dgIJem9zItFRdwIDAQAB-----END PUBLIC KEY-----";
