import { DfTxHeader } from '@components/transactions/[txid]/DfTx/DfTxHeader'
import { CurrencyPair, DfTx, UpdateOracle } from '@defichain/jellyfish-transaction'
import { AdaptiveList } from '@components/commons/AdaptiveList'
import { fromScript } from '@defichain/jellyfish-address'
import { useNetworkObject } from '@contexts/NetworkContext'
import { OverflowTable } from '@components/commons/OverflowTable'

interface DfTxUpdateOracleProps {
  dftx: DfTx<UpdateOracle>
}
export function DfTxUpdateOracle (props: DfTxUpdateOracleProps): JSX.Element {
  const network = useNetworkObject().name
  const address = fromScript(props.dftx.data.script, network)?.address

  return (
    <div>
      <DfTxHeader name='Update Oracle' />
      <div className='mt-5 flex flex-col space-y-6 items-start lg:flex-row lg:space-x-8 lg:space-y-0'>
        <AdaptiveList className='w-full lg:w-1/2'>
          <AdaptiveList.Row name='Oracle ID' testId='DfTxUpdateOracle.OracleId' className='break-all'>
            {props.dftx.data.oracleId}
          </AdaptiveList.Row>
          <AdaptiveList.Row name='Address' testId='DfTxUpdateOracle.Address'>
            {address ?? 'N/A'}
          </AdaptiveList.Row>
          <AdaptiveList.Row name='Weightage' testId='DfTxUpdateOracle.Weightage'>
            {props.dftx.data.weightage}
          </AdaptiveList.Row>
        </AdaptiveList>
        <AdaptiveList className='w-full lg:w-1/2'>
          <OverflowTable>
            <OverflowTable.Header>
              <OverflowTable.Head>Token</OverflowTable.Head>
              <OverflowTable.Head>Currency</OverflowTable.Head>
            </OverflowTable.Header>
            {props.dftx.data.priceFeeds.map((priceFeed) => (
              <UpdateOracleTableRow priceFeed={priceFeed} key={`${priceFeed.token}-${priceFeed.currency}`} />
            )
            )}
          </OverflowTable>
        </AdaptiveList>
      </div>
    </div>
  )
}

function UpdateOracleTableRow (props: { priceFeed: CurrencyPair }): JSX.Element {
  return (
    <OverflowTable.Row>
      <OverflowTable.Cell>
        <span data-testId={`DfTxUpdateOracle.${props.priceFeed.token}Token`}>{props.priceFeed.token}</span>
      </OverflowTable.Cell>
      <OverflowTable.Cell>
        <span data-testId={`DfTxUpdateOracle.${props.priceFeed.token}Currency`}>{props.priceFeed.currency}</span>
      </OverflowTable.Cell>
    </OverflowTable.Row>
  )
}