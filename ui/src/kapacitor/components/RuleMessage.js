import React, {Component, PropTypes} from 'react'
import _ from 'lodash'
import classnames from 'classnames'

import RuleMessageOptions from 'src/kapacitor/components/RuleMessageOptions'
import RuleMessageText from 'src/kapacitor/components/RuleMessageText'
import RuleMessageTemplates from 'src/kapacitor/components/RuleMessageTemplates'
import Dropdown from 'shared/components/Dropdown'

import {DEFAULT_ALERTS, RULE_ALERT_OPTIONS} from 'src/kapacitor/constants'

class RuleMessage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedAlertNodeName: null,
    }
  }

  handleChangeMessage = e => {
    const {actions, rule} = this.props
    actions.updateMessage(rule.id, e.target.value)
  }

  handleChooseAlert = item => () => {
    const {actions} = this.props
    actions.updateAlerts(item.ruleID, [item.text])
    actions.updateAlertNodes(item.ruleID, item.text, '')
    this.setState({selectedAlertNodeName: item.text})
  }

  render() {
    const {rule, actions, enabledAlerts} = this.props
    const defaultAlertEndpoints = DEFAULT_ALERTS.map(text => {
      return {text, ruleID: rule.id}
    })

    const alerts = [
      ...defaultAlertEndpoints,
      ...enabledAlerts.map(text => {
        return {text, ruleID: rule.id}
      }),
    ]

    const selectedAlertNodeName = rule.alerts[0] || alerts[0].text

    const dropdownDummyClick = selectedItem => {
      console.log(selectedItem.text)
    }
    const dropdownDummyItems = [
      {text: 'swoggle'},
      {text: 'yoggle'},
      {text: 'zoggle'},
      {text: 'doggle'},
    ]

    return (
      <div className="rule-section">
        <h3 className="rule-section--heading">Alert Message</h3>
        <div className="rule-section--body">
          <div className="rule-section--row rule-section--row-first rule-section--border-bottom">
            <p>Send this Alert to:</p>
            <ul className="nav nav-tablist nav-tablist-sm nav-tablist-malachite">
              {alerts
                // only display alert endpoints that have rule alert options configured
                .filter(alert => _.get(RULE_ALERT_OPTIONS, alert.text, false))
                .map(alert =>
                  <li
                    key={alert.text}
                    className={classnames({
                      active: alert.text === selectedAlertNodeName,
                    })}
                    onClick={this.handleChooseAlert(alert)}
                  >
                    {alert.text}
                    <div className="nav-tab--delete" />
                  </li>
                )}
            </ul>
            <Dropdown
              items={dropdownDummyItems}
              menuClass="dropdown-malachite"
              selected="Add an Endpoint"
              onChoose={dropdownDummyClick}
              className="dropdown-140"
            />
          </div>
          <RuleMessageOptions
            rule={rule}
            alertNodeName={selectedAlertNodeName}
            updateAlertNodes={actions.updateAlertNodes}
            updateDetails={actions.updateDetails}
            updateAlertProperty={actions.updateAlertProperty}
          />
          <RuleMessageText
            rule={rule}
            updateMessage={this.handleChangeMessage}
          />
          <RuleMessageTemplates
            rule={rule}
            updateMessage={actions.updateMessage}
          />
        </div>
      </div>
    )
  }
}

const {arrayOf, func, shape, string} = PropTypes

RuleMessage.propTypes = {
  rule: shape({}).isRequired,
  actions: shape({
    updateAlertNodes: func.isRequired,
    updateMessage: func.isRequired,
    updateDetails: func.isRequired,
    updateAlertProperty: func.isRequired,
  }).isRequired,
  enabledAlerts: arrayOf(string.isRequired).isRequired,
}

export default RuleMessage
