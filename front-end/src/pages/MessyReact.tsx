import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";

interface IssueSection {
  title: string;
  items: string[];
}

interface ImprovementSection {
  title: string;
  code: string;
}

const MessyReact: React.FC = () => {
  const issues: IssueSection[] = [
    {
      title: "Type Safety Issues",
      items: [
        "Using `any` type for blockchain parameter in getPriority function",
        "Missing proper type definitions for blockchain property in WalletBalance interface",
        "Props interface is empty and extends BoxProps without adding any properties",
      ],
    },
    {
      title: "Performance Issues",
      items: [
        "getPriority function is recreated on every render - should be memoized",
        "sortedBalances useMemo dependency array includes prices but prices isn't used in the calculation",
        "formattedBalances is recalculated on every render - should be memoized",
        "Using index as key in the rows mapping is an anti-pattern",
      ],
    },
    {
      title: "Logic Issues",
      items: [
        "Balance filtering logic is incorrect - lhsPriority is undefined",
        "The condition 'if (lhsPriority > -99)' should be 'if (balancePriority > -99)'",
        "The filter condition returns true for negative balances, which seems incorrect",
        "Missing error handling for price calculations",
      ],
    },
    {
      title: "Code Structure Issues",
      items: [
        "getPriority function should be moved outside the component",
        "Missing proper error boundaries",
        "No loading states for async operations (useWalletBalances and usePrices)",
        "Missing proper TypeScript enums for blockchain types",
      ],
    },
  ];

  const improvements: ImprovementSection[] = [
    {
      title: "Type Safety Improvements",
      code: `enum Blockchain {
  OSMOSIS = 'Osmosis',
  ETHEREUM = 'Ethereum',
  ARBITRUM = 'Arbitrum',
  ZILLIQA = 'Zilliqa',
  NEO = 'Neo'
}

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}`,
    },
    {
      title: "Performance Improvements",
      code: `const getPriority = useCallback((blockchain: Blockchain): number => {
  switch (blockchain) {
    case Blockchain.OSMOSIS: return 100;
    case Blockchain.ETHEREUM: return 50;
    case Blockchain.ARBITRUM: return 30;
    case Blockchain.ZILLIQA:
    case Blockchain.NEO: return 20;
    default: return -99;
  }
}, []);

const sortedBalances = useMemo(() => {
  return balances
    .filter((balance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > -99 && balance.amount > 0;
    })
    .sort((lhs, rhs) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority;
    });
}, [balances, getPriority]);

const formattedBalances = useMemo(() => 
  sortedBalances.map((balance) => ({
    ...balance,
    formatted: balance.amount.toFixed()
  })), [sortedBalances]);`,
    },
    {
      title: "Error Handling Improvements",
      code: `const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const { balances, isLoading: balancesLoading } = useWalletBalances();
  const { prices, isLoading: pricesLoading } = usePrices();

  if (balancesLoading || pricesLoading) {
    return <LoadingSpinner />;
  }

  const rows = formattedBalances.map((balance) => {
    const price = prices[balance.currency];
    if (!price) {
      console.error(\`No price found for currency: \${balance.currency}\`);
      return null;
    }
    const usdValue = price * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={\`\${balance.currency}-\${balance.blockchain}\`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  }).filter(Boolean);`,
    },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: "#0a1929", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#fff",
          mb: 4,
          textAlign: "center",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        Code Analysis: React Performance & Best Practices
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              bgcolor: "rgba(255,255,255,0.95)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              borderRadius: 2,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#1976d2",
                fontWeight: "bold",
                borderBottom: "2px solid #1976d2",
                pb: 1,
                mb: 3,
              }}
            >
              Issues Found
            </Typography>
            {issues.map((section, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#0a1929",
                    fontWeight: "bold",
                    mb: 1,
                  }}
                >
                  {section.title}
                </Typography>
                <List sx={{ bgcolor: "#f5f5f5", borderRadius: 1, p: 1 }}>
                  {section.items.map((item, itemIndex) => (
                    <ListItem
                      key={itemIndex}
                      sx={{
                        borderBottom:
                          itemIndex !== section.items.length - 1
                            ? "1px solid #e0e0e0"
                            : "none",
                        py: 1,
                      }}
                    >
                      <ListItemText
                        primary={item}
                        sx={{
                          "& .MuiListItemText-primary": {
                            fontSize: "0.9rem",
                            color: "#333",
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              bgcolor: "rgba(255,255,255,0.95)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              borderRadius: 2,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#2e7d32",
                fontWeight: "bold",
                borderBottom: "2px solid #2e7d32",
                pb: 1,
                mb: 3,
              }}
            >
              Suggested Improvements
            </Typography>
            {improvements.map((section, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#0a1929",
                    fontWeight: "bold",
                    mb: 1,
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  component="code"
                  sx={{
                    display: "block",
                    p: 2,
                    bgcolor: "#1e1e1e",
                    borderRadius: 1,
                    whiteSpace: "pre-wrap",
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    color: "#d4d4d4",
                    border: "1px solid #2d2d2d",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
                    '& .keyword': {
                      color: "#569cd6"  // blue for keywords
                    },
                    '& .string': {
                      color: "#ce9178"  // orange for strings
                    },
                    '& .function': {
                      color: "#dcdcaa"  // yellow for functions
                    },
                    '& .type': {
                      color: "#4ec9b0"  // green for types
                    },
                    '& .interface': {
                      color: "#4ec9b0"  // green for interfaces
                    },
                    '& .enum': {
                      color: "#4ec9b0"  // green for enums
                    },
                    '& .property': {
                      color: "#9cdcfe"  // light blue for properties
                    },
                    '& .comment': {
                      color: "#6a9955"  // green for comments
                    }
                  }}
                >
                  {section.code.split('\n').map((line, i) => {
                    // Add syntax highlighting
                    const highlightedLine = line
                      .replace(/(enum|interface|const|return|case|default|if)\b/g, '<span class="keyword">$1</span>')
                      .replace(/(string|number|boolean)\b/g, '<span class="type">$1</span>')
                      .replace(/('.*?')/g, '<span class="string">$1</span>')
                      .replace(/(Blockchain|WalletBalance|Props)\b/g, '<span class="interface">$1</span>')
                      .replace(/(useCallback|useMemo|filter|map|sort)\b/g, '<span class="function">$1</span>')
                      .replace(/(\w+):/g, '<span class="property">$1</span>');
                    
                    return (
                      <div
                        key={i}
                        dangerouslySetInnerHTML={{ __html: highlightedLine }}
                        style={{ minHeight: '1.5em' }}
                      />
                    );
                  })}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessyReact;
