import React from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { PrtgDataSourceOptions } from './types';

const { FormField } = LegacyForms;

interface OptionProps extends DataSourcePluginOptionsEditorProps<PrtgDataSourceOptions> {}

export function PrtgConfigEditor(Props:OptionProps){
  const {onOptionsChange,options} = Props

  function handleHostnameChange(hostnameInput:any) {
    console.log(options)
    const jsonData = {
      ...options.jsonData,
      hostname:hostnameInput.target.value
    }
    onOptionsChange({
      ...options,
      jsonData
    })
  }

  function handlePasshashChange(passhashInput:any) {
    const jsonData = {
      ...options.jsonData,
      passhash:passhashInput.target.value
    }
    onOptionsChange({
      ...options,
      jsonData
    })
  }

  function handleUsernameChange(usernameInput:any) {
    const jsonData = {
      ...options.jsonData,
      username:usernameInput.target.value
    }
    onOptionsChange({
      ...options,
      jsonData
    });
  }

  return (
    <section style={{margin:5}}>      
      <FormField label={"Hostname"} onChange={handleHostnameChange} value={options.jsonData.hostname}></FormField>
      <FormField label={"Username"} onChange={handleUsernameChange} value={options.jsonData.username}></FormField>
      <FormField label={"Passhash"} onChange={handlePasshashChange} value={options.jsonData.passhash}></FormField>
    </section>
  )
}