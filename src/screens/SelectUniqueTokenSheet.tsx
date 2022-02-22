import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useContext, useEffect, useMemo } from 'react';
import { Animated as RNAnimated } from 'react-native';
import { useMemoOne } from 'use-memo-one';
import {
  RecyclerAssetListContext,
  RecyclerAssetListScrollPositionContext,
} from '../components/asset-list/RecyclerAssetList2/core/Contexts';
import RawMemoRecyclerAssetList from '../components/asset-list/RecyclerAssetList2/core/RawRecyclerList';
import { StickyHeaderManager } from '../components/asset-list/RecyclerAssetList2/core/StickyHeaders';
import { CellType } from '../components/asset-list/RecyclerAssetList2/core/ViewTypes';
import useMemoBriefSectionData from '../components/asset-list/RecyclerAssetList2/core/useMemoBriefSectionData';
import { SheetHandle } from '../components/sheet';
import { ModalContext } from '../react-native-cool-modals/NativeStackView';
import { Box } from '@rainbow-me/design-system';

export default function ShowcaseScreen() {
  const { params } = useRoute();
  const { goBack } = useNavigation();
  const { layout } = useContext(ModalContext) || {};

  useEffect(() => {
    setTimeout(() => layout?.(), 300);
  }, [layout]);

  const {
    memoizedResult: briefSectionsData,
    additionalData,
  } = useMemoBriefSectionData({
    filterTypes: [
      CellType.NFT_SPACE_AFTER,
      CellType.NFT,
      CellType.FAMILY_HEADER,
    ],
  });
  const position = useMemoOne(() => new RNAnimated.Value(0), []);

  const value = useMemo(
    () => ({
      additionalData,
      /* @ts-expect-error No types for `asset` yet */
      onPressUniqueToken: asset => {
        /* @ts-expect-error No types for `param` yet */
        params.onSelect?.(asset);
        goBack();
      },
    }),
    [additionalData, goBack, params]
  );

  return (
    <Box background="body" height="full" paddingTop="34px">
      <Box alignItems="center" justifyContent="center" paddingVertical="10px">
        {/* @ts-expect-error JavaScript component */}
        <SheetHandle />
      </Box>
      <RecyclerAssetListScrollPositionContext.Provider value={position}>
        <RecyclerAssetListContext.Provider value={value}>
          <StickyHeaderManager>
            <RawMemoRecyclerAssetList briefSectionsData={briefSectionsData} />
          </StickyHeaderManager>
        </RecyclerAssetListContext.Provider>
      </RecyclerAssetListScrollPositionContext.Provider>
    </Box>
  );
}
