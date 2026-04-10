import { isAddress } from "viem";

import { isArray, isNumberString, isString } from "@/lib/utils";

const VAL_MSG = {
  formattingError:
    "Incorrect formatting. Check formatting rules in tooltip above.",
  LOOT_ERR:
    "Loot is required and must be a number. Check formatting rules in tooltip above.",
  SHARE_ERR:
    "Shares are required and must be a number. Check formatting rules in tooltip above.",
  ADDRESS_ERR:
    "Member addresses are required and must be valid Ethereum addresses. Check formatting rules in tooltip above.",
  SHAMAN_ADDR_ERR:
    "Shaman addresses are required and must be valid Ethereum addresses.",
  PERMISSION_ERR: "Shaman permissions are required and must be a number.",
};

export const validateMemberData = (
  memberData: Record<string, string[]> | "",
) => {
  if (memberData === "") return true;
  const { memberAddresses, memberShares, memberLoot } = memberData;

  if (
    !isArray(memberAddresses) ||
    !isArray(memberShares) ||
    !isArray(memberLoot)
  ) {
    return VAL_MSG.formattingError;
  }

  if (!memberAddresses.every((address) => isAddress(address))) {
    return VAL_MSG.ADDRESS_ERR;
  }

  if (!memberShares.every((amount) => isNumberString(amount))) {
    return VAL_MSG.SHARE_ERR;
  }

  if (!memberLoot.every((amount) => isNumberString(amount))) {
    return VAL_MSG.LOOT_ERR;
  }

  return true;
};

export const transformMemberData = (response: string | undefined) => {
  if (!isString(response) || response === "") return "";

  const memberEntities = response
    .split(/[\n|,]/)
    .map((str) => str.trim())
    .filter(Boolean);

  return memberEntities.reduce(
    (acc, member) => {
      const [memberAddress, memberShares, memberLoot] = member.trim().split(" ");

      return {
        memberAddresses: [...acc.memberAddresses, memberAddress],
        memberShares: [...acc.memberShares, memberShares],
        memberLoot: [...acc.memberLoot, memberLoot],
      };
    },
    {
      memberAddresses: [] as string[],
      memberShares: [] as string[],
      memberLoot: [] as string[],
    },
  );
};

export const validateShamanData = (
  shamanData: Record<string, string[]> | "",
) => {
  if (shamanData === "") return true;

  const { shamanAddresses, shamanPermissions } = shamanData;

  if (!isArray(shamanAddresses) || !isArray(shamanPermissions)) {
    return VAL_MSG.formattingError;
  }

  if (!shamanAddresses.every((address) => isAddress(address))) {
    return VAL_MSG.SHAMAN_ADDR_ERR;
  }

  if (!shamanPermissions.every((permission) => isNumberString(permission))) {
    return VAL_MSG.PERMISSION_ERR;
  }

  return true;
};

export const transformShamans = (response: string | undefined) => {
  if (!isString(response) || response === "") return "";

  const shamanEntities = response
    .split(/[\n|,]/)
    .map((str) => str.trim())
    .filter(Boolean);

  return shamanEntities.reduce(
    (acc, shaman) => {
      const [shamanAddress, shamanPermission] = shaman.trim().split(" ");

      return {
        shamanAddresses: [...acc.shamanAddresses, shamanAddress],
        shamanPermissions: [...acc.shamanPermissions, shamanPermission],
      };
    },
    {
      shamanAddresses: [] as string[],
      shamanPermissions: [] as string[],
    },
  );
};
