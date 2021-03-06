import React, {Component, PropTypes} from 'react'
import _ from 'lodash'

import LayoutCellMenu from 'shared/components/LayoutCellMenu'
import LayoutCellHeader from 'shared/components/LayoutCellHeader'

class LayoutCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDeleting: false,
    }
  }

  closeMenu = () => {
    this.setState({
      isDeleting: false,
    })
  }

  handleDeleteClick = () => {
    this.setState({isDeleting: true})
  }

  handleDeleteCell = cell => () => {
    this.props.onDeleteCell(cell)
  }

  handleSummonOverlay = cell => () => {
    this.props.onSummonOverlayTechnologies(cell)
  }

  render() {
    const {cell, children, isEditable} = this.props

    const {isDeleting} = this.state
    const queries = _.get(cell, ['queries'], [])

    return (
      <div className="dash-graph">
        <LayoutCellMenu
          cell={cell}
          isDeleting={isDeleting}
          isEditable={isEditable}
          onDelete={this.handleDeleteCell}
          onEdit={this.handleSummonOverlay}
          handleClickOutside={this.closeMenu}
          onDeleteClick={this.handleDeleteClick}
        />
        <LayoutCellHeader
          queries={queries}
          cellName={cell.name}
          isEditable={isEditable}
        />
        <div className="dash-graph--container">
          {queries.length
            ? children
            : <div className="graph-empty">
                <button
                  className="no-query--button btn btn-md btn-primary"
                  onClick={this.handleSummonOverlay(cell)}
                >
                  <span className="icon plus" /> Add Graph
                </button>
              </div>}
        </div>
      </div>
    )
  }
}

const {arrayOf, bool, func, node, number, shape, string} = PropTypes

LayoutCell.propTypes = {
  cell: shape({
    name: string.isRequired,
    isEditing: bool,
    x: number.isRequired,
    y: number.isRequired,
    queries: arrayOf(shape()),
  }).isRequired,
  children: node.isRequired,
  onDeleteCell: func,
  onSummonOverlayTechnologies: func,
  isEditable: bool,
  onCancelEditCell: func,
}

export default LayoutCell
