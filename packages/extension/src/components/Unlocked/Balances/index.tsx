import { useEffect } from "react";
import { PluginRenderer } from "@200ms/anchor-ui-renderer";
import { useNavigation, useTablePlugins } from "@200ms/recoil";
import { SettingsButton } from "../../Settings";
import { TransferWidget } from "./TransferWidget";
import { BalanceSummaryWidget } from "./BalanceSummaryWidget";
import { TokensWidget } from "./TokensWidget";

export function Balances() {
  const { setNavButtonRight } = useNavigation();
  useEffect(() => {
    setNavButtonRight(<SettingsButton />);
    return () => {
      setNavButtonRight(null);
    };
  }, []);
  return (
    <div>
      <BalanceSummaryWidget blockchain={"solana"} />
      <TransferWidget />
      <TokensWidget />
      <PluginTables />
    </div>
  );
}

function PluginTables() {
  const tablePlugins = useTablePlugins();
  return (
    <>
      {tablePlugins.map((plugin: any) => {
        return <PluginRenderer key={plugin.iframeUrl} plugin={plugin} />;
      })}
    </>
  );
}
