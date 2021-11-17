import { LoanVaultActive, LoanVaultLiquidated, LoanVaultState } from '@defichain/whale-api-client/dist/api/loan'
import { AddressLink } from '@components/commons/AddressLink'
import { VaultCollapsibleSection } from '@components/vaults/common/VaultCollapsibleSection'
import { OverflowTable } from '@components/commons/OverflowTable'
import { TextMiddleTruncate } from '@components/commons/TextMiddleTruncate'
import { VaultCollateralizationRatio } from '@components/vaults/common/VaultCollateralizationRatio'
import classNames from 'classnames'
import { VaultDetailsListItem } from '@components/vaults/common/VaultDetailsListItem'
import BigNumber from 'bignumber.js'
import { VaultNumberValues } from '@components/vaults/common/VaultNumberValues'
import React from 'react'
import ReactNumberFormat from 'react-number-format'

export function VaultIdDetails (props: { vault: LoanVaultActive | LoanVaultLiquidated }): JSX.Element {
  return (
    <>
      <div className='mt-8 hidden md:block'>
        <h2 className='text-xl font-semibold' data-testid='VaultDetailsDesktop.Heading'>
          Vault Details
        </h2>
        <OverflowTable className='mt-3'>
          <OverflowTable.Header>
            <OverflowTable.Head
              title={'Owner\'s Address'}
              testId='VaultDetailsDesktop.OwnerAddress'
            />

            <OverflowTable.Head
              alignRight
              title='Total Loan Value (USD)'
              infoDesc='Total loan value (in USD) taken by the vault.'
              testId='VaultDetailsDesktop.TotalLoanValue'
            />

            <OverflowTable.Head
              alignRight
              title='Accumulated Interest (USD)'
              infoDesc='Total interest incurred to date'
              testId='VaultDetailsDesktop.AccumulatedInterest'
            />

            <OverflowTable.Head
              alignRight
              title='Total Collateral Value (USD)'
              infoDesc='Total value of tokens (in USD) deposited as collaterals in the vault.'
              testId='VaultDetailsDesktop.TotalCollateralValue'
            />

            <OverflowTable.Head
              alignRight
              title='Total Collateralization Ratio'
              infoDesc='Percentage of collaterals deposited in a vault in relation to the amount of loan taken.'
              testId='VaultDetailsDesktop.TotalCollateralizationRatio'
            />

            <OverflowTable.Head
              alignRight
              title='Min Collateralization Ratio'
              infoDesc='Minimum required collateral ratio based on vault scheme selected by vault owner.'
              testId='VaultDetailsDesktop.MinCollateralizationRatio'
            />

            <OverflowTable.Head
              alignRight
              title='Vault Interest Rate (APR)'
              infoDesc='Annual Vault Interest Rate based on the scheme selected by the vault owner.'
              testId='VaultDetailsDesktop.VaultInterestRate '
            />
          </OverflowTable.Header>
          <DesktopVaultDetailsRow vault={props.vault} />
        </OverflowTable>
      </div>

      <VaultCollapsibleSection
        heading='Vault Details' className='block md:hidden'
        testId='VaultCollapsibleSection.VaultIdDetails'
      >
        <div className='mb-8'>
          <MobileVaultDetails vault={props.vault} />
        </div>
      </VaultCollapsibleSection>
    </>
  )
}

function DesktopVaultDetailsRow (props: { vault: LoanVaultActive | LoanVaultLiquidated }): JSX.Element {
  return (
    <OverflowTable.Row
      className={classNames(props.vault.state === LoanVaultState.FROZEN ? 'text-gray-200' : 'text-gray-900')}
    >
      <OverflowTable.Cell>
        <AddressLink address={props.vault.ownerAddress} testId='VaultTableRow.OwnerId'>
          <TextMiddleTruncate text={props.vault.ownerAddress} textLength={6} />
        </AddressLink>
      </OverflowTable.Cell>
      <OverflowTable.Cell className='text-right'>
        {props.vault.state === LoanVaultState.IN_LIQUIDATION
          ? ('N/A')
          : (
            <VaultNumberValues
              value={new BigNumber(props.vault.loanValue).minus(props.vault.interestValue)}
              prefix='$'
            />
            )}
      </OverflowTable.Cell>
      <OverflowTable.Cell className='text-right'>
        {props.vault.state === LoanVaultState.IN_LIQUIDATION
          ? ('N/A')
          : (
            <VaultNumberValues value={new BigNumber(props.vault.interestValue)} prefix='$' />
            )}
      </OverflowTable.Cell>
      <OverflowTable.Cell className='text-right'>
        {props.vault.state === LoanVaultState.IN_LIQUIDATION
          ? ('N/A')
          : (
            <VaultNumberValues value={new BigNumber(props.vault.collateralValue)} prefix='$' />
            )}
      </OverflowTable.Cell>
      <OverflowTable.Cell className='text-right'>
        {props.vault.state === LoanVaultState.IN_LIQUIDATION
          ? ('N/A')
          : (<VaultCollateralizationRatio
              collateralizationRatio={props.vault.collateralRatio}
              loanScheme={props.vault.loanScheme}
              vaultState={props.vault.state}
             />)}
      </OverflowTable.Cell>
      <OverflowTable.Cell className='text-right'>
        {props.vault.state === LoanVaultState.IN_LIQUIDATION
          ? ('N/A')
          : (<ReactNumberFormat
              value={props.vault.loanScheme.minColRatio}
              suffix='%'
              displayType='text'
              thousandSeparator
             />)}
      </OverflowTable.Cell>
      <OverflowTable.Cell className='text-right'>
        {props.vault.state === LoanVaultState.IN_LIQUIDATION
          ? ('N/A')
          : (
            <VaultNumberValues value={new BigNumber(props.vault.loanScheme.interestRate)} suffix='%' />
            )}
      </OverflowTable.Cell>
    </OverflowTable.Row>
  )
}

function MobileVaultDetails (props: { vault: LoanVaultActive | LoanVaultLiquidated }): JSX.Element {
  return (
    <div
      className={classNames('flex flex-col gap-y-0.5', props.vault.state === LoanVaultState.FROZEN ? 'text-gray-200' : 'text-gray-900')}
    >
      <VaultDetailsListItem
        title={'Owner\'s Address'}
        testId='VaultDetailList.OwnerAddress'
      >
        <AddressLink address={props.vault.ownerAddress} testId='VaultTableRow.OwnerId'>
          <TextMiddleTruncate text={props.vault.ownerAddress} textLength={6} />
        </AddressLink>
      </VaultDetailsListItem>
      <VaultDetailsListItem
        title='Total Loan Value (USD)'
        infoDesc='Total loan value (in USD) taken by the vault.'
        testId='VaultDetailList.TotalLoanValue'
      >
        {props.vault.state === LoanVaultState.IN_LIQUIDATION
          ? 'N/A'
          : (
            <VaultNumberValues
              value={new BigNumber(props.vault.loanValue).minus(props.vault.interestValue)}
              prefix='$'
            />
            )}
      </VaultDetailsListItem>
      <VaultDetailsListItem
        title='Accumulated Interest (USD)'
        infoDesc='Total interest incurred to date'
        testId='VaultDetailList.AccumulatedInterest'
      >
        {props.vault.state === LoanVaultState.IN_LIQUIDATION
          ? 'N/A'
          : (
            <VaultNumberValues value={new BigNumber(props.vault.interestValue)} prefix='$' />
            )}
      </VaultDetailsListItem>
      <VaultDetailsListItem
        title='Total Collateral Value (USD)'
        infoDesc='Total value of tokens (in USD) deposited as collaterals in the vault.'
        testId='VaultDetailList.TotalCollateralValue'
      >
        {props.vault.state === LoanVaultState.IN_LIQUIDATION
          ? ('N/A')
          : (
            <VaultNumberValues value={new BigNumber(props.vault.collateralValue)} prefix='$' />
            )}
      </VaultDetailsListItem>
      <VaultDetailsListItem
        title='Total Collateralization Ratio'
        infoDesc='Percentage of collaterals deposited in a vault in relation to the amount of loan taken.'
        testId='VaultDetailList.TotalCollateralizationRatio'
      >
        {props.vault.state === LoanVaultState.IN_LIQUIDATION
          ? ('N/A')
          : (<VaultCollateralizationRatio
              collateralizationRatio={props.vault.collateralRatio}
              loanScheme={props.vault.loanScheme}
              vaultState={props.vault.state}
             />)}
      </VaultDetailsListItem>
      <VaultDetailsListItem
        title='Min Collateralization Ratio'
        infoDesc='Minimum required collateral ratio based on vault scheme selected by vault owner.'
        testId='VaultDetailList.MinCollateralizationRatio'
      >
        {props.vault.state === LoanVaultState.IN_LIQUIDATION
          ? ('N/A')
          : (<ReactNumberFormat
              value={props.vault.loanScheme.minColRatio}
              suffix='%'
              displayType='text'
              thousandSeparator
             />)}
      </VaultDetailsListItem>
      <VaultDetailsListItem
        title='Vault Interest Rate (APR)'
        infoDesc='Annual Vault Interest Rate based on the scheme selected by the vault owner.'
        testId='VaultDetailList.VaultInterestRate'
      >
        {props.vault.state === LoanVaultState.IN_LIQUIDATION
          ? 'N/A'
          : (
            <VaultNumberValues value={new BigNumber(props.vault.loanScheme.interestRate)} suffix='%' />
            )}
      </VaultDetailsListItem>
    </div>
  )
}