import { useCallback, useMemo, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Margin, RoundedContainerGroup } from "@components";
import { ExpandCollapseIcon, IconCheckmark } from "@components/Icon";
import { UI_RPC_METHOD_ACTIVE_USER_UPDATE } from "@coral-xyz/common";
import { useAllUsers, useBackgroundClient, useUser } from "@coral-xyz/recoil";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@hooks";
import { HeaderBackButton } from "@react-navigation/elements";
import { SettingsRow } from "@screens/Unlocked/Settings/components/SettingsRow";

export function AccountDropdownHeader({
  navigation,
  options,
}: {
  navigation: any;
  options: any;
}): JSX.Element {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const user = useUser();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%"], []);

  const handleShowModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  return (
    <>
      <Pressable
        onPress={handleShowModal}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            color: theme.custom.colors.fontColor,
          }}>
          @{user.username}
        </Text>
        <ExpandCollapseIcon
          isExpanded={false}
          color={theme.custom.colors.icon}
        />
      </Pressable>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: theme.custom.colors.backgroundBackdrop,
        }}>
        <UserAccountMenu onDismiss={handleDismissModal} />
      </BottomSheetModal>
    </>
  );
}

function UserAccountMenu({ onDismiss }: () => void): JSX.Element {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.custom.colors.backgroundBackdrop,
        paddingHorizontal: 16,
      }}>
      <Text
        style={{
          marginTop: 8,
          marginBottom: 16,
          fontSize: 18,
          fontWeight: "600",
          color: theme.custom.colors.fontColor,
        }}>
        Accounts
      </Text>
      <UsersList onDismiss={onDismiss} />
      <Margin vertical={12}>
        <AddAnotherAccountButton />
      </Margin>
    </View>
  );
}

function AddAnotherAccountButton() {
  return (
    <Pressable
      disabled
      style={{ flexDirection: "row", alignItems: "center" }}
      onPress={() => {
        // openAddUserAccount();
      }}>
      <MaterialIcons name="add" size={28} style={{ marginRight: 4 }} />
      <Text
        style={{
          fontSize: 16,
          color: "inherit",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}>
        Add Another Account
      </Text>
    </Pressable>
  );
}

function UsersList({ onDismiss }: () => void): JSX.Element {
  const background = useBackgroundClient();
  const users = useAllUsers();
  const _user = useUser();

  const handlePressItem = async (uuid: string) => {
    await background.request({
      method: UI_RPC_METHOD_ACTIVE_USER_UPDATE,
      params: [uuid],
    });

    onDismiss();
  };

  return (
    <RoundedContainerGroup>
      {users.map(({ username, uuid }: any, idx: number) => (
        <UserAccountListItem
          key={username}
          uuid={uuid}
          username={username}
          isActive={_user.username === username}
          onPress={handlePressItem}
        />
      ))}
    </RoundedContainerGroup>
  );
}

function UserAccountListItem({
  uuid,
  username,
  isActive,
  onPress,
}: {
  uuid: string;
  username: string;
  isActive: boolean;
  onPress: (uuid: string) => void;
}): JSX.Element {
  return (
    <SettingsRow
      icon={<Avatar size={24} />}
      label={`@${username}`}
      detailIcon={isActive ? <IconCheckmark size={24} /> : null}
      onPress={() => onPress(uuid)}
    />
  );
}
