import React, { useState } from 'react';
import { BaseRetractingLabelInput } from './input';

export const SearchSelect = ({search, label, description, onSelect, setSearch, candidates}) => {

    const items = candidates.map((candidate) => (
        <li
            onClick={() => onSelect(candidate)}
            key={candidate.name}
            className="cm-candidate"
        >
            {candidate.value}
        </li>
    ));

    let searchCandidates
    if (items.length > 0)
        searchCandidates = <ul className="cm-candidates">{items}</ul>;

    return <div className="cm-search-select">
        <form onSubmit={(e) => {e.preventDefault();onSelect()}}>
        <BaseRetractingLabelInput
            onChange={setSearch}
            label={label}
            description={description}
            autoComplete="off"
            value={search}
        >
            {searchCandidates}
        </BaseRetractingLabelInput>
        </form>
    </div>

}
