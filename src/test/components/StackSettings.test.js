/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
// @flow
import * as React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { Provider } from 'react-redux';
import StackSettings from '../../components/shared/StackSettings';
import { storeWithProfile } from '../fixtures/stores';
import {
  getImplementationFilter,
  getCurrentSearchString,
} from '../../selectors/url-state';

describe('StackSettings', function() {
  function setup() {
    jest.useFakeTimers();
    const store = storeWithProfile();

    const renderResult = render(
      <Provider store={store}>
        <StackSettings />
      </Provider>
    );

    return {
      ...renderResult,
      ...store,
    };
  }

  it('matches the snapshot', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });

  it('can change the implementation filter to JavaScript', function() {
    const { getByLabelText, getState } = setup();
    expect(getImplementationFilter(getState())).toEqual('combined');
    const radioButton = getByLabelText(/JavaScript/);

    radioButton.click();

    expect(radioButton.hasAttribute('checked'));
    expect(getImplementationFilter(getState())).toEqual('js');
  });

  it('can change the implementation filter to Native', function() {
    const { getByLabelText, getState } = setup();
    expect(getImplementationFilter(getState())).toEqual('combined');
    const radioButton = getByLabelText(/Native/);

    radioButton.click();

    expect(radioButton.hasAttribute('checked'));
    expect(getImplementationFilter(getState())).toEqual('cpp');
  });

  it('can change the implementation filter to All stacks', function() {
    const { getByLabelText, getState } = setup();
    getByLabelText(/Native/).click();
    expect(getImplementationFilter(getState())).toEqual('cpp');
    const radioButton = getByLabelText(/All stacks/);

    radioButton.click();

    expect(radioButton.hasAttribute('checked'));
    expect(getImplementationFilter(getState())).toEqual('combined');
  });

  it('can change the search', function() {
    const { getByLabelText, getState } = setup();
    expect(getCurrentSearchString(getState())).toEqual('');
    const searchText = 'some search';
    const input: HTMLInputElement = (getByLabelText(/Filter stacks/): any);

    fireEvent.change(input, {
      target: { value: searchText },
    });

    jest.runAllTimers();
    expect(getCurrentSearchString(getState())).toEqual(searchText);
    expect(input.value).toEqual(searchText);
  });
});
