import React, { Component } from 'react';
import PropTypes from 'prop-types';

const EnhancedTab = ({
  index,
  id,
  label,
  selected,
  className,
  style,
  selectedClassName,
  selected_style,
  selectHandler,
  value,
  disabled,
  disabled_style,
  disabled_className,
  mobile_breakpoint,
  amountOfTabs,
  colors
}) => {
  let tabStyle = style;
  if(disabled) {
    tabStyle = { ...tabStyle, ...disabled_style }
  }
  if(selected) {
    tabStyle = { ...tabStyle, ...selected_style}
  }
  let tabClassName = `${className || ''} tab`
  if(disabled) {
    tabClassName += ` ${disabled_className|| ''} tab--disabled`
  }
  if(selected) {
    tabClassName += ` ${selectedClassName || ''} tab--selected`
  }
  return (
    <div
      className={tabClassName}
      id={id}
      style={tabStyle}
      onClick={() => {
        if(!disabled) {
          selectHandler(index, value);
        }
      }}
    >
      <span>{label}</span>
      <style jsx>{`
        .tab {
          display: inline-block;
          background-color: ${colors['background']};
          border: 1px solid ${colors['border']};
          border-bottom: none;
          padding: 20px 25px;
          transition: background-color, color 200ms;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
        }
        .tab:last-of-type {
          border-right: 1px solid ${colors['border']};
          border-bottom: 1px solid ${colors['border']};
        }
        .tab:hover {
          cursor: pointer;
        }
        .tab--selected {
          border-top: 2px solid ${colors['primary']};
          color: black;
          background-color: white;
        }
        .tab--selected:hover {
          background-color: white;
        }
        .tab--disabled {
          color: #d6d6d6;
        }

        @media screen and (min-width: ${mobile_breakpoint}px) {
          .tab {
            border: 1px solid ${colors['border']};
            border-right: none;
            width: calc(100% / ${amountOfTabs});
          }
          .tab--selected {
            border-bottom: none !important;
            border-top: 2px solid ${colors['primary']};
          }
        }
      `}</style>
    </div>
  );
};

/**
 * A Dash component that lets you render pages with tabs - the Tabs component's children
 * can be dcc.Tab components, which can hold a label that will be displayed as a tab, and can in turn hold
 * children components that will be that tab's content.
 */
export default class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    };

    this.selectHandler = this.selectHandler.bind(this);
  }
  selectHandler(index, value) {
    this.setState({
      selected: index
    });
    if (this.props.setProps) {
      this.props.setProps({ value: value });
    }
  }
  render() {
    let EnhancedTabs;

    if (!Array.isArray(this.props.children)) {
      // if dcc.Tabs.children contains just one single element, it gets passed as an object
      // instead of an array - so we put in in array ourselves!
      this.props.children = [this.props.children];
    }

    const amountOfTabs = this.props.children.length

    EnhancedTabs = this.props.children.map((child, index) => {
      // TODO: handle components that are not dcc.Tab components (throw error)
      // enhance Tab components coming from Dash (as dcc.Tab) with methods needed for handling logic
      let childProps;

      if (child.props.children) {
        // if props appears on .children, props are coming from Dash
        childProps = child.props.children.props;
      } else {
        // else props are coming from React (Demo.react.js)
        childProps = child.props;
      }
      return (
        <EnhancedTab
          key={index}
          index={index}
          id={childProps.id}
          label={childProps.label}
          selected={this.state.selected === index}
          selectHandler={this.selectHandler}
          className={childProps.className}
          style={childProps.style}
          selectedClassName={childProps.selected_className}
          selected_style={childProps.selected_style}
          value={childProps.value}
          disabled={childProps.disabled}
          disabled_style={childProps.disabled_style}
          disabled_classname={childProps.disabled_className}
          mobile_breakpoint={this.props.mobile_breakpoint}
          amountOfTabs={amountOfTabs}
          colors={this.props.colors}
        />
      );
    });

    const tabContainerClass = this.props.vertical
      ? 'tab-container tab-container--vert'
      : 'tab-container';

    const tabContentClass = this.props.vertical
      ? 'tab-content tab-content--vert'
      : 'tab-content';

    const tabParentClass = this.props.vertical
      ? 'tab-parent tab-parent--vert'
      : 'tab-parent';

    return (
      <div
        className={`${tabParentClass} ${this.props.parent_className || ''}`}
        style={this.props.parent_style}
      >
        <div
          className={`${tabContainerClass} ${this.props.className || ''}`}
          style={this.props.style}
        >
          {EnhancedTabs}
        </div>
        <div
          className={`${tabContentClass} ${this.props.content_className || ''}`}
          style={this.props.content_style}
        >
          {this.props.children[this.state.selected].props.children}
        </div>
        <style jsx>{`
          .tab-parent {
            display: flex;
            flex-direction: column;
          }
          .tab-container--vert {
            display: inline-flex;
            flex-direction: column;
          }
          .tab-content--vert {
            display: inline-flex;
            flex-direction: column;
          }
          @media screen and (min-width: ${this.props.mobile_breakpoint}px) {
            :global(.tab-container--vert .tab) {
              width: auto;
              border-right: none !important;
              border-bottom: none;
            }
            :global(.tab-container--vert .tab:last-of-type) {
              border-bottom: 1px solid ${this.props.colors['border']} !important;
            }
            :global(.tab-container--vert .tab--selected) {
              border: 1px solid ${this.props.colors['border']};
              border-left: 2px solid ${this.props.colors['primary']};
              border-right: none;
            }

            .tab-parent--vert {
              display: inline-flex;
              flex-direction: row;
            }
          }
        `}</style>
      </div>
    );
  }
}

Tabs.defaultProps = {
  mobile_breakpoint: 800,
  colors: {
    border: '#d6d6d6',
    primary: '#1975FA',
    background: '#f9f9f9'
  }
};

Tabs.propTypes = {
  /**
   * The ID of this component, used to identify dash components
   * in callbacks. The ID needs to be unique across all of the
   * components in an app.
   */
  id: PropTypes.string,

  /**
   * The value of the currently selected Tab
   */
  value: PropTypes.string,

  /**
   * Appends a class to the Tabs container holding the individual Tab components.
   */
  className: PropTypes.string,

  /**
   * Appends a class to the Tab content container holding the children of the Tab that is selected.
   */
  content_className: PropTypes.string,

  /**
   * Appends a class to the top-level parent container holding both the Tabs container and the content container.
   */
  parent_className: PropTypes.string,

  /**
   * Appends (inline) styles to the Tabs container holding the individual Tab components.
   */
  style: PropTypes.object,

  /**
   * Appends (inline) styles to the top-level parent container holding both the Tabs container and the content container.
   */
  parent_style: PropTypes.object,

  /**
   * Appends (inline) styles to the tab content container holding the children of the Tab that is selected.
   */
  content_style: PropTypes.object,

  /**
   * Renders the tabs vertically (on the side)
   */
  vertical: PropTypes.bool,

  /**
   * Breakpoint at which tabs are rendered full width (can be 0 if you don't want full width tabs on mobile)
   */
  mobile_breakpoint: PropTypes.number,

  /**
   * Array that holds Tab components
   */
  children: PropTypes.node,

  /**
   * Holds the colors used by the Tabs and Tab components. If you set these, you should specify colors for all properties, so: 
   * colors: {
   *    border: '#d6d6d6',
   *    primary: '#1975FA',
   *    background: '#f9f9f9'
   *  }
   */
  colors: PropTypes.shape({border: PropTypes.string, primary: PropTypes.string, background: PropTypes.string})
};