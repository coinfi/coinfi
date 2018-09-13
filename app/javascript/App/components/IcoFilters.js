import ReactOnRails from 'react-on-rails'
import Filters from './Filters'
import container from '../containers/icoFilters'
import withStore from '../withStore'

const IcoFiltersWithStore = withStore(container(Filters))

ReactOnRails.register({ IcoFilters: IcoFiltersWithStore })
