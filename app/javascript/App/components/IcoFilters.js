import Filters from './Filters'
import container from '../containers/icoFilters'
import withLegacyCombinedProviders from '../withLegacyCombinedProviders'

export default withLegacyCombinedProviders(container(Filters))
