import tw, { styled } from 'twin.macro';

export const TableContainer = styled.div(() => [
  tw`rounded-sm border-2 border-background-tertiary shadow`,
  tw`[h2]:(font-bold flex items-center justify-between)`,
  tw`[h2, th, td]:(px-4 py-4 sm:px-8)`,
]);

export const StyledTable = styled.table(() => [
  tw`w-full`,
  tw`[th]:(text-sm font-normal text-gray-500)`,
  tw`[tr]:(border-t border-background-tertiary)`,
  tw`[th, td]:(first:text-left text-center last:text-right)`,
]);
